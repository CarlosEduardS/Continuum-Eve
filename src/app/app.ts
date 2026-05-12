import { Component, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  url = '';

  constructor(private router: Router, private title: Title){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.url = event.urlAfterRedirects;
        this.title.setTitle(`Continuum-Eve${this.url}`);
      }
    });
  }
}
