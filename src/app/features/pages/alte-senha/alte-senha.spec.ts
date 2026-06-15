import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlteSenha } from './alte-senha';

describe('AlteSenha', () => {
  let component: AlteSenha;
  let fixture: ComponentFixture<AlteSenha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlteSenha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlteSenha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
