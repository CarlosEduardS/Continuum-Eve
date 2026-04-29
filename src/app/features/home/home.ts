import { Component } from '@angular/core';
import { LayoutMainInterface } from "../../shared/layout/layout-main-interface/layout-main-interface";
import { Card } from "../../shared/ui/card/card";
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [LayoutMainInterface, Card, ReactiveFormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
