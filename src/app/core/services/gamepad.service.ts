import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';
import { GamepadCommand } from '../models/gamepad-command.model';

@Injectable({
  providedIn: 'root'
})
export class GamepadService implements OnDestroy {

  // ─── Streams públicos ──────────────────────────────────────────────────────

  // command$ emite a cada frame enquanto o controle estiver conectado
  // O Controller component vai se subscrever aqui
  readonly command$ = new Subject<GamepadCommand>();

  // connected$ é um BehaviorSubject — ele guarda o último valor emitido
  // Útil pra checar o estado atual sem precisar estar subscrito
  readonly connected$ = new BehaviorSubject<boolean>(false);

  // ─── Estado interno ────────────────────────────────────────────────────────

  private platformId = inject(PLATFORM_ID);

  // Índice do controle no array do navigator.getGamepads()
  // Sempre pega o primeiro controle conectado (índice 0)
  private gamepadIndex = -1;

  // ID do requestAnimationFrame — guardamos pra poder cancelar quando necessário
  private animFrameId = 0;

  // Timestamp do último comando enviado — usado pro throttle de 50ms
  private lastSentTime = 0;

  // Último comando enviado — usado pra detectar se houve mudança
  private lastCommand: GamepadCommand = { x: 0, y: 0, connected: false, gamepadId: '' };

  // ─── Threshold do throttle ─────────────────────────────────────────────────
  // Só envia um novo comando se passaram pelo menos 50ms desde o último
  // Evita spam de 60 HTTP requests por segundo pro .NET
  private readonly THROTTLE_MS = 50;

  // ─── Deadzone ─────────────────────────────────────────────────────────────
  // Valores abaixo de 12% do range são considerados ruído mecânico e viram 0
  private readonly DEADZONE = 0.12;

  constructor() {
    // Só registra os listeners se estiver no browser (não no SSR do Angular)
    if (isPlatformBrowser(this.platformId)) {
      this.registerBrowserEvents();
    }
  }

  // ─── Registro dos eventos do browser ──────────────────────────────────────

  private registerBrowserEvents(): void {
    // gamepadconnected: dispara quando o usuário pressiona qualquer botão no controle
    // (o browser não detecta o controle só de plugar — precisa de interação)
    window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
      this.gamepadIndex = e.gamepad.index;
      this.connected$.next(true);
      this.startPolling(); // começa o loop de leitura
    });

    // gamepaddisconnected: dispara quando o controle é desconectado
    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadIndex = -1;
      this.connected$.next(false);
      this.stopPolling(); // para o loop

      // Emite um comando zerado pra garantir que o robô para
      this.command$.next({ x: 0, y: 0, connected: false, gamepadId: '' });
    });
  }

  // ─── Loop de polling ───────────────────────────────────────────────────────

  private startPolling(): void {
    // Cancela qualquer loop anterior antes de iniciar um novo
    this.stopPolling();
    this.poll();
  }

  private stopPolling(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = 0;
    }
  }

  private poll(): void {
    // navigator.getGamepads() retorna o estado ATUAL do controle neste frame
    // É um snapshot — não acumula eventos como um EventListener faria
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[this.gamepadIndex];

    if (gamepad) {
      // ── Lê os eixos e botões ──────────────────────────────────────────────

      // axes[0] = analógico esquerdo horizontal
      const rawX = gamepad.axes[0] ?? 0;

      // buttons[7] = gatilho direito (RT/R2) → frente
      // buttons[6] = gatilho esquerdo (LT/L2) → ré
      // .value vai de 0.0 (solto) a 1.0 (totalmente pressionado)
      const rt = gamepad.buttons[7]?.value ?? 0;
      const lt = gamepad.buttons[6]?.value ?? 0;

      // Velocidade: RT empurra pra frente (+), LT empurra pra trás (-)
      // Se os dois estiverem apertados ao mesmo tempo, se cancelam → 0
      const rawY = rt - lt;

      // ── Aplica deadzone ───────────────────────────────────────────────────
      const x = this.applyDeadzone(rawX);
      // Gatilhos não têm drift como analógicos, mas aplicamos por consistência
      const y = this.applyDeadzone(rawY);

      const now = performance.now();
      const changed = x !== this.lastCommand.x || y !== this.lastCommand.y;
      const throttleOk = (now - this.lastSentTime) >= this.THROTTLE_MS;

      // Só emite se o valor mudou E já passou o tempo mínimo
      // Exceção: se y=0 e x=0 (parado), sempre emite pra garantir que o robô para
      const shouldSend = (changed && throttleOk) || (x === 0 && y === 0 && this.lastCommand.y !== 0);

      if (shouldSend) {
        const command: GamepadCommand = {
          x,
          y,
          connected: true,
          gamepadId: gamepad.id
        };

        this.command$.next(command);
        this.lastCommand = command;
        this.lastSentTime = now;
      }
    }

    // Agenda o próximo frame — isso é o que mantém o loop rodando
    // ~60 vezes por segundo, sincronizado com o refresh rate da tela
    this.animFrameId = requestAnimationFrame(() => this.poll());
  }

  // ─── Deadzone ─────────────────────────────────────────────────────────────

  private applyDeadzone(value: number): number {
    if (Math.abs(value) < this.DEADZONE) return 0;

    // Remapeia o range restante para manter a progressividade
    // Sem isso, ao sair da deadzone o valor pularia de 0 pra 0.12 abruptamente
    // Com isso, sai suavemente de 0 → 1 no range [deadzone, 1.0]
    const sign = value > 0 ? 1 : -1;
    return sign * (Math.abs(value) - this.DEADZONE) / (1 - this.DEADZONE);
  }

  // ─── Cleanup ───────────────────────────────────────────────────────────────

  ngOnDestroy(): void {
    this.stopPolling();
    this.command$.complete();
    this.connected$.complete();
  }
}