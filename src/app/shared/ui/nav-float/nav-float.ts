import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-float',
  imports: [RouterLink],
  templateUrl: './nav-float.html',
  styleUrl: './nav-float.scss',
})
export class NavFloat {
  IsAdmin = sessionStorage.getItem('isAdmin') === 'true';
}
