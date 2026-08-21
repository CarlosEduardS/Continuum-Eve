import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { GamepadCommand } from '../models/gamepad-command.model';

@Injectable({
  providedIn: 'root'
})
export class RobotService implements OnDestroy {

  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly commandUrl = 'http://localhost:5171/api/robot/command';
  private readonly robotHubUrl = 'http://localhost:5171/robotHub';
  private readonly hubConnection: HubConnection | null;

  readonly robotData$ = new Subject<unknown>();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.robotHubUrl)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection.on('ReceiveRobotData', (data: unknown) => {
        this.robotData$.next(data);
      });

      void this.hubConnection.start().catch((error: unknown) => {
        console.error('[RobotService] Erro ao conectar ao hub:', error);
      });
    } else {
      this.hubConnection = null;
    }
  }

  sendCommand(command: GamepadCommand): void {
    const x = parseFloat(command.x.toFixed(2));
    const y = parseFloat(command.y.toFixed(2));

    this.http.post(this.commandUrl, { x, y }).subscribe({
      next: () => console.log('[RobotService] Comando enviado:', { x, y }),
      error: (error: unknown) => console.error('[RobotService] Erro ao enviar comando:', error)
    });
  }

  ngOnDestroy(): void {
    this.robotData$.complete();
    void this.hubConnection?.stop();
  }
}