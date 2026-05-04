export interface GamepadCommand {
  x: number;         // Analógico esquerdo horizontal: -1.0 (esquerda) → 0.0 (centro) → +1.0 (direita)
  y: number;         // Gatilhos: RT - LT → -1.0 (ré) → 0.0 (parado) → +1.0 (frente)
  connected: boolean;
  gamepadId: string; // Nome do controle conectado (ex: "Xbox 360 Controller")
}