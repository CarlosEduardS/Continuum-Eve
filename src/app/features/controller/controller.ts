import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutMainInterface } from '../../shared/layout/layout-main-interface/layout-main-interface';
import { GamepadService } from '../../core/services/gamepad.service';
import { RobotService } from '../../core/services/robot.service';
import { GamepadCommand } from '../../core/models/gamepad-command.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [LayoutMainInterface, DecimalPipe],
  templateUrl: './controller.html',
  styleUrl: './controller.scss',
})
export class Controller implements OnInit, OnDestroy {

  // ─── Injeção de dependências ──────────────────────────────────────────────
  private gamepadService = inject(GamepadService);
  private robotService = inject(RobotService);

  // ─── State reativo (signals) ──────────────────────────────────────────────

  // Estado atual do comando — atualizado a cada frame com mudança
  readonly currentCommand = signal<GamepadCommand>({
    x: 0,
    y: 0,
    connected: false,
    gamepadId: ''
  });

  // Indica se o controle está conectado
  readonly isConnected = signal(false);

  // Direção textual calculada a partir de x e y — pra mostrar no HUD
  readonly direction = signal('Parado');

  // ─── Subscrições ──────────────────────────────────────────────────────────

  // Guardamos as subscrições pra poder cancelar no ngOnDestroy
  // Não cancelar causa memory leak — o service continua emitindo mesmo depois
  // que o componente é destruído (quando o usuário muda de rota)
  private commandSub!: Subscription;
  private connectedSub!: Subscription;

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Subscreve no stream de conexão
    this.connectedSub = this.gamepadService.connected$.subscribe(connected => {
      this.isConnected.set(connected);

      // Quando desconecta, zera o estado visual
      if (!connected) {
        this.currentCommand.set({ x: 0, y: 0, connected: false, gamepadId: '' });
        this.direction.set('Parado');
      }
    });

    // Subscreve no stream de comandos
    // Cada emissão do GamepadService cai aqui
    this.commandSub = this.gamepadService.command$.subscribe(command => {
      // Atualiza o estado visual
      this.currentCommand.set(command);
      this.direction.set(this.calculateDirection(command));

      // Envia pro robô
      // Por enquanto só loga — quando o .NET estiver pronto vai fazer HTTP
      this.robotService.sendCommand(command);
    });
  }

  ngOnDestroy(): void {
    // IMPORTANTE: sempre cancelar subscrições no destroy
    // Se não fizer isso, o callback continua rodando mesmo depois
    // que o componente é destruído — isso causa memory leak
    this.commandSub?.unsubscribe();
    this.connectedSub?.unsubscribe();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  // Calcula uma string legível baseada nos valores de x e y
  // Usado só pra exibição no HUD — não tem efeito no robô
  private calculateDirection(cmd: GamepadCommand): string {
    const moving = Math.abs(cmd.y) > 0.05;
    const turning = Math.abs(cmd.x) > 0.05;

    if (!moving && !turning) return 'Parado';

    const parts: string[] = [];

    if (moving) parts.push(cmd.y > 0 ? 'Frente' : 'Ré');
    if (turning) parts.push(cmd.x > 0 ? 'Direita' : 'Esquerda');

    return parts.join(' + ');
  }

  // Converte o valor -1→1 pra uma porcentagem 0→100 pra barra de progresso no HUD
  toPercent(value: number): number {
    return Math.round(Math.abs(value) * 100);
  }

  // Converte o valor de direção X pra uma posição visual na barra (-100% a +100%)
  toOffsetPercent(value: number): number {
    return Math.round(value * 100);
  }
}