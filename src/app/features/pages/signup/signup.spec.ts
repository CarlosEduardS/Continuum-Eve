import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

import { Signup } from './signup';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        { provide: Router, useValue: { navigate: () => undefined } },
        { provide: AuthService, useValue: { register: () => undefined } },
        { provide: ToastrService, useValue: { error: () => undefined, success: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('moves focus to the next input when Enter is pressed', () => {
    const inputs = Array.from(
      fixture.nativeElement.querySelectorAll('input'),
    ) as HTMLInputElement[];
    const focusSpy = vi.spyOn(inputs[1], 'focus');
    const event = {
      target: inputs[0],
      preventDefault: vi.fn(),
    } as unknown as Event;

    component.handleEnter(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('submits when Enter is pressed on the last input', () => {
    const inputs = Array.from(
      fixture.nativeElement.querySelectorAll('input'),
    ) as HTMLInputElement[];
    const submitSpy = vi.spyOn(component, 'submit');
    const event = {
      target: inputs[inputs.length - 1],
      preventDefault: vi.fn(),
    } as unknown as Event;

    component.handleEnter(event);

    expect(submitSpy).toHaveBeenCalled();
  });
});
