// src/app/features/pages/login/login.ts

import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../../shared/layout/default-login-layout/default-login-layout';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { PrimaryInput } from '../../../shared/ui/primary-input/primary-input';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DefaultLoginLayout, ReactiveFormsModule, PrimaryInput, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        this.toastService.success(`Bem-vindo, ${response.username}!`);
        // Redireciona pro home após login
        this.router.navigate(['/home']);
      },
      error: (err) => {
        // 401 = credenciais inválidas
        if (err.status === 401) {
          this.toastService.error('Email ou senha inválidos.');
        } else {
          this.toastService.error('Erro ao fazer login. Tente novamente.');
        }
      }
    });
  }

  navigate() {
    this.router.navigate(['/signup']);
  }
}