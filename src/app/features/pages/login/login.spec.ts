import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  async function createLogin(isLoggedIn: boolean) {
    const navigations: unknown[][] = [];

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        {
          provide: Router,
          useValue: { navigate: (commands: unknown[]) => navigations.push(commands) },
        },
        { provide: ActivatedRoute, useValue: {} },
        { provide: AuthService, useValue: { isLoggedIn: () => isLoggedIn } },
        {
          provide: ToastrService,
          useValue: { error: () => undefined, info: () => undefined, success: () => undefined },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();

    return navigations;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', async () => {
    await createLogin(false);

    expect(component).toBeTruthy();
  });

  it('redirects to home when a saved session exists', async () => {
    const navigations = await createLogin(true);

    expect(navigations).toEqual([['/home']]);
  });

  it('stays on login when there is no saved session', async () => {
    const navigations = await createLogin(false);

    expect(navigations).toEqual([]);
  });
});
