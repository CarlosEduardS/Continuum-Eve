import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';
import { GamepadCommand } from '../models/gamepad-command.model';
import { RobotService } from './robot.service';

@Injectable({
  providedIn: 'root'
})
export class GamepadService implements OnDestroy {

  // ─── Dependências Injetadas ────────────────────────────────────────────────
  private platformId = inject(PLATFORM_ID);
  private robotService = inject(RobotService);

  // ─── Streams Públicos ──────────────────────────────────────────────────────
  
  // command$ emite a cada frame válido para os componentes Angular escutarem
  readonly command$ = new Subject<GamepadCommand>();

  // connected$ guarda o estado atual de conexão do controle
  readonly connected$ = new BehaviorSubject<boolean>(false);

  // ─── Estado Interno ────────────────────────────────────────────────────────
  
  // Índice do controle no array do navigator.getGamepads()
  private gamepadIndex = -1;

  // ID do requestAnimationFrame para cancelamento no cleanup
  private animFrameId = 0;

  // Timestamp do último comando enviado — usado no throttle de 50ms
  private lastSentTime = 0;

  // Último comando emitido para detecção de mudanças de estado
  private lastCommand: GamepadCommand = { x: 0, y: 0, connected: false, gamepadId: '' };

  // ─── Thresholds de Tratamento do Analog ────────────────────────────────────
  private readonly THROTTLE_MS = 50;
  private readonly DEADZONE = 0.12;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.registerBrowserEvents();
    }
  }

  // ─── Eventos Globais da Gamepad API ───────────────────────────────────────

  private registerBrowserEvents(): void {
    window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
      this.gamepadIndex = e.gamepad.index;
      this.connected$.next(true);
      this.startPolling();
    });

    window.addEventListener('gamepaddisconnected', () => {
      this.gamepadIndex = -1;
      this.connected$.next(false);
      this.stopPolling();

      // Emite comando zerado localmente e para a API do robô
      const stopCommand: GamepadCommand = { x: 0, y: 0, connected: false, gamepadId: '' };
      this.command$.next(stopCommand);
      this.robotService.sendCommand(stopCommand);
    });
  }

  // ─── Polling Loop (60 FPS / requestAnimationFrame) ─────────────────────────

  private startPolling(): void {
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
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[this.gamepadIndex];

    if (gamepad) {
      // axes[0] = Analógico esquerdo horizontal
      const rawX = gamepad.axes[0] ?? 0;

      // buttons[7] = Gatilho Direito (RT/R2) -> Aceleração Frente (+)
      // buttons[6] = Gatilho Esquerdo (LT/L2) -> Aceleração Ré (-)
      const rt = gamepad.buttons[7]?.value ?? 0;
      const lt = gamepad.buttons[6]?.value ?? 0;
      const rawY = rt - lt;

      // Aplicação da deadzone
      const x = this.applyDeadzone(rawX);
      const y = this.applyDeadzone(rawY);

      const now = performance.now();
      const changed = x !== this.lastCommand.x || y !== this.lastCommand.y;
      const throttleOk = (now - this.lastSentTime) >= this.THROTTLE_MS;

      // Regra de Emissão:
      // 1. Mudou de valor E passou o limite do throttle (50ms)
      // 2. EXCEÇÃO: Parada total (x=0, y=0) enquanto o último estado era em movimento (garante parada imediata do robô)
      const shouldSend = (changed && throttleOk) || (x === 0 && y === 0 && (this.lastCommand.x !== 0 || this.lastCommand.y !== 0));

      if (shouldSend) {
        const command: GamepadCommand = {
          x,
          y,
          connected: true,
          gamepadId: gamepad.id
        };

        // Emite internamente para a aplicação Angular
        this.command$.next(command);
        
        // Envia para o RobotService enviar ao .NET
        this.robotService.sendCommand(command);

        this.lastCommand = command;
        this.lastSentTime = now;
      }
    }

    this.animFrameId = requestAnimationFrame(() => this.poll());
  }

  // ─── Truncamento Suave por Deadzone ───────────────────────────────────────

  private applyDeadzone(value: number): number {
    if (Math.abs(value) < this.DEADZONE) return 0;

    const sign = value > 0 ? 1 : -1;
    return sign * (Math.abs(value) - this.DEADZONE) / (1 - this.DEADZONE);
  }

  // ─── Limpeza e Desalocação ────────────────────────────────────────────────

  ngOnDestroy(): void {
    this.stopPolling();
    this.command$.complete();
    this.connected$.complete();
  }
}