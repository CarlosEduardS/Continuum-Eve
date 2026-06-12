import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavFloat } from './nav-float';

describe('NavFloat', () => {
  let component: NavFloat;
  let fixture: ComponentFixture<NavFloat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavFloat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavFloat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
