import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { LayoutMainInterface } from "../../shared/layout/layout-main-interface/layout-main-interface";
import { Card } from "../../shared/ui/card/card";
import { ReactiveFormsModule } from '@angular/forms';
import { MapInfoComponent } from "../../shared/ui/map-info-component/map-info-component";

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
@Component({
  selector: 'app-home',
  imports: [LayoutMainInterface, Card, ReactiveFormsModule, MapInfoComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home {
  status = 'ativo';
  batery = 100;
  charge = ''
  distance = 218;
  TPlanted = 76234;
  AcPlanted = 23;

  isMapTrue = false

constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(){
    if (this.status === 'carregando')
      this.charge = '⚡'
    else if (this.status === 'desativado')
      this.charge = '❓'
    
    this.distance = random(10, 999);
    
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.distance = random(10, 999);
        this.batery -= 1;

        if (this.batery === 0)
          this.batery = 100;
        this.cdr.markForCheck();
      }, 1000);
    });
  }

  ToggleMap() {
    this.isMapTrue = !this.isMapTrue
  }
}
