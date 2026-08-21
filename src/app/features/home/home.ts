import { Component, NgZone, ChangeDetectorRef, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutMainInterface } from "../../shared/layout/layout-main-interface/layout-main-interface";
import { Card } from "../../shared/ui/card/card";
import { ReactiveFormsModule } from '@angular/forms';
import { MapInfoComponent } from "../../shared/ui/map-info-component/map-info-component";
import { CommonModule } from '@angular/common';
import { RobotService } from '../../core/services/robot.service';
@Component({
  selector: 'app-home',
  imports: [LayoutMainInterface, Card, ReactiveFormsModule, MapInfoComponent, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home implements OnDestroy {
  private readonly robotService = inject(RobotService);
  private robotDataSubscription?: Subscription;

  status = 'ativo';
  batery = 100;
  charge = ''
  distance: number | null = null;
  TPlanted = 76234;
  AcPlanted = 23;

  isMapTrue = false

constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(){
    if (this.status === 'carregando')
      this.charge = '⚡'
    else if (this.status === 'desativado')
      this.charge = '❓'

    this.robotDataSubscription = this.robotService.robotData$.subscribe(data => {
      const distance = this.extractDistance(data);

      if (distance !== null) {
        this.ngZone.run(() => {
          this.distance = distance;
          this.cdr.markForCheck();
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.robotDataSubscription?.unsubscribe();
  }

  private extractDistance(data: unknown): number | null {
    const payload = typeof data === 'string' ? this.parsePayload(data) : data;

    if (!payload || typeof payload !== 'object') return null;

    const record = payload as Record<string, unknown>;
    const distance = record['distance']
      ?? record['Distance']
      ?? record['distancia']
      ?? record['Distancia'];

    const numericDistance = typeof distance === 'number'
      ? Math.round(distance)
      : Math.round(Number(distance));

    return Number.isFinite(numericDistance) ? numericDistance : null;
  }

  private parsePayload(data: string): unknown {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  ToggleMap() {
    this.isMapTrue = !this.isMapTrue
  }
}
