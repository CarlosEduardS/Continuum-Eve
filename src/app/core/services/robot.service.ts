import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GamepadCommand } from '../models/gamepad-command.model';

@Injectable({
  providedIn: 'root'
})
export class RobotService {

  private http = inject(HttpClient);

  // URL base do Adan-Stella — ajustar quando o backend estiver pronto
  private readonly apiUrl = 'http://localhost:5000/api/robot';

  // ─── Stub ─────────────────────────────────────────────────────────────────
  // Por enquanto só loga no console
  // Quando o .NET estiver pronto, descomentar o http.post e remover o console.log
  sendCommand(command: GamepadCommand): void {
    const payload = {
      x: parseFloat(command.x.toFixed(2)), // arredonda pra 2 casas — o ESP32 não precisa de mais precisão
      y: parseFloat(command.y.toFixed(2))
    };

    console.log('[RobotService] Comando:', payload);

    // TODO: descomentar quando o Adan-Stella estiver com o endpoint pronto
    // this.http.post(`${this.apiUrl}/command`, payload).subscribe({
    //   error: (err) => console.error('[RobotService] Erro ao enviar comando:', err)
    // });
  }
}