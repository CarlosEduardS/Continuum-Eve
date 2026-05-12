import { Component, output } from '@angular/core';
import { Card } from "../card/card";

@Component({
  selector: 'app-map-info-component',
  imports: [Card],
  templateUrl: './map-info-component.html',
  styleUrl: './map-info-component.scss',
})
export class MapInfoComponent {
  batery = '98%';
  charge = ''
  isReturn = output<boolean>();

  return(){
    this.isReturn.emit(true);
  }
}
