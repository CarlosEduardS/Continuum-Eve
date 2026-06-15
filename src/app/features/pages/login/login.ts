// src/app/features/pages/login/login.ts

import { Component, OnInit } from '@angular/core';
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
export class Login implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  isDisabled = true; // Controla se o botão de esquecer senha está desativado visualmente

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

  ngOnInit(): void {
    // Escuta em tempo real o que é digitado no campo de e-mail
    this.loginForm.get('email')?.valueChanges.subscribe((value) => {
      const emailValue = value || '';
      const emailControl = this.loginForm.get('email');

      // Se tiver mais de 5 caracteres e passar no validador de e-mail do Angular, habilita o botão
      if (emailValue.length > 5 && emailControl?.valid) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    });
  }

  // Método chamado ao clicar no botão "Esqueceu a senha?"
  handleForgotPassword() {
    // Segurança extra: se por algum motivo for clicado enquanto desativado, ignora
    if (this.isDisabled) return;

    const email = this.loginForm.get('email')?.value;

    this.toastService.info('Verificando e-mail no sistema...');

    // Faz a chamada para o Back-end verificar a existência no banco de dados
    this.authService.checkEmailExists(email!).subscribe({
      next: (exists) => {
        if (exists) {
          this.toastService.success('E-mail localizado! Redirecionando...');
          // Se o e-mail existe, navega para a tela de reset
          this.router.navigate(['/password-reset'], { queryParams: { email: email } });
        } else {
          this.toastService.error('Este e-mail não está cadastrado no sistema.');
        }
      },
      error: (err) => {
        this.toastService.error('Erro ao validar o e-mail. Tente novamente mais tarde.');
      }
    });
  }

  submit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        this.toastService.success(`Bem-vindo, ${response.username}!`);
        this.router.navigate(['/home']);
      },
      error: (err) => {
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