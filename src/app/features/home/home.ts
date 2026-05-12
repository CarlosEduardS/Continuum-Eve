import { Component } from '@angular/core';
import { LayoutMainInterface } from "../../shared/layout/layout-main-interface/layout-main-interface";
import { Card } from "../../shared/ui/card/card";
import { ReactiveFormsModule } from '@angular/forms';
import { MapInfoComponent } from "../../shared/ui/map-info-component/map-info-component";

@Component({
  selector: 'app-home',
  imports: [LayoutMainInterface, Card, ReactiveFormsModule, MapInfoComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  status = 'ativo';
  batery = '98%';
  charge = ''
  distance = 218;
  TPlanted = 76234;
  AcPlanted = 23;

  isMapTrue = false

  ngOnInit(){
    if (this.status === 'carregando')
      this.charge = '⚡'
    else if (this.status === 'desativado')
      this.charge = '❓'
  }

  ToggleMap() {
    this.isMapTrue = !this.isMapTrue
  }
}
