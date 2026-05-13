import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-profile',
  imports: [RouterLink, TitleCasePipe, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})

export class Profile {
  username = sessionStorage.getItem('username') || 'Usuário';
  isAdmin  = sessionStorage.getItem('isAdmin') === 'true';
  
  private dateStr = sessionStorage.getItem('dateCreate');
  date: Date | null = this.dateStr ? new Date(this.dateStr) : null;
 
  badge = this.isAdmin ? 'Administrador' : 'Membro';
}
