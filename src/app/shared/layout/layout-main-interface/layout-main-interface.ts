import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink} from "@angular/router";
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-layout-main-interface',
  imports: [RouterLink, CommonModule],
  templateUrl: './layout-main-interface.html',
  styleUrl: './layout-main-interface.scss',
})
export class LayoutMainInterface {
  IsAdmin = false;

  constructor(public auth: Auth) {
    this.IsAdmin = this.auth.IsAdmin;
  }

  toggleAdmin() {
    this.auth.IsAdmin = !this.auth.IsAdmin;
    this.IsAdmin = this.auth.IsAdmin;
  }
}
