import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMainInterface } from './layout-main-interface';

describe('LayoutMainInterface', () => {
  let component: LayoutMainInterface;
  let fixture: ComponentFixture<LayoutMainInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutMainInterface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutMainInterface);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
