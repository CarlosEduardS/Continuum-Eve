import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-profile',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})

export class Profile {
  username = sessionStorage.getItem('username') || 'Usuário';
  isAdmin  = sessionStorage.getItem('isAdmin') === 'true';
 
  badge = this.isAdmin ? 'Administrador' : 'Membro';
}
