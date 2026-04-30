import { Component } from '@angular/core';
import { RouterLink, Router } from "@angular/router";

@Component({
  selector: 'app-layout-main-interface',
  imports: [RouterLink],
  templateUrl: './layout-main-interface.html',
  styleUrl: './layout-main-interface.scss',
})
export class LayoutMainInterface {
  IsAdmin = true

  constructor(private router: Router){}

  ifAdmin(){
    if (this.IsAdmin)
      this.router.navigate(['/controller'])
  }
}
