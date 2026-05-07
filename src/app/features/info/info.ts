import { Component } from '@angular/core';
import { LayoutMainInterface } from "../../shared/layout/layout-main-interface/layout-main-interface";
import { Card } from "../../shared/ui/card/card";

@Component({
  selector: 'app-info',
  imports: [LayoutMainInterface, Card],
  templateUrl: './info.html',
  styleUrl: './info.scss',
})
export class Info {

}
