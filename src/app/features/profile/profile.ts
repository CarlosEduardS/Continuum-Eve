import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})

export class Profile {
  username = sessionStorage.getItem('username') || 'User';
}
