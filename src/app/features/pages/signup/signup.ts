// src/app/features/pages/signup/signup.ts

import { Component } from '@angular/core';
import { DefaultLoginLayout } from '../../../shared/layout/default-login-layout/default-login-layout';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { PrimaryInput } from '../../../shared/ui/primary-input/primary-input';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

interface SignupForm {
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirme: FormControl<string | null>;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [DefaultLoginLayout, ReactiveFormsModule, PrimaryInput],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  SignupForm!: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastrService
  ) {
    this.SignupForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirme: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit() {
    if (this.SignupForm.invalid) return;

    const { username, email, password, passwordConfirme } = this.SignupForm.value;

    // Valida se as senhas coincidem antes de enviar pro backend
    if (password !== passwordConfirme) {
      this.toastService.error('As senhas não coincidem.');
      return;
    }

    this.authService.register(username!, email!, password!).subscribe({
      next: (response) => {
        this.toastService.success(`Conta criada! Bem-vindo, ${response.username}!`);
        // Redireciona pro home após criar a conta
        this.router.navigate(['/home']);
      },
      error: (err) => {
        // 409 = email já em uso
        if (err.status === 409) {
          this.toastService.error('Este email já está em uso.');
        } else {
          this.toastService.error('Erro ao criar conta. Tente novamente.');
        }
      }
    });
  }

  navigate() {
    this.router.navigate(['/login']);
  }
}