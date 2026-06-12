import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink} from "@angular/router";
import { NavFloat } from "../../ui/nav-float/nav-float";

@Component({
  selector: 'app-layout-main-interface',
  imports: [RouterLink, CommonModule, NavFloat],
  templateUrl: './layout-main-interface.html',
  styleUrl: './layout-main-interface.scss',
})
export class LayoutMainInterface {
  IsAdmin = sessionStorage.getItem('isAdmin') === 'true';
}
