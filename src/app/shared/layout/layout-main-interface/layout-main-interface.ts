import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink} from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout-main-interface',
  imports: [RouterLink, CommonModule],
  templateUrl: './layout-main-interface.html',
  styleUrl: './layout-main-interface.scss',
})
export class LayoutMainInterface {
  IsAdmin = false;

  constructor(public authService: AuthService) {
    this.IsAdmin = this.authService.IsAdmin;
  }

  //Botao de teste de rotas de admin
  toggleAdmin() {
    this.authService.IsAdmin = !this.authService.IsAdmin;
    this.IsAdmin = this.authService.IsAdmin;
  }
}
