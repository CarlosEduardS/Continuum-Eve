import { Component } from '@angular/core';
import { DefaultLoginLayout } from "../../../shared/layout/default-login-layout/default-login-layout";
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { PrimaryInput } from "../../../shared/ui/primary-input/primary-input";
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../../core/services/login';
import { ToastrService } from 'ngx-toastr';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [LoginService],
  imports: [DefaultLoginLayout, ReactiveFormsModule, PrimaryInput, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  submit(){
    this.loginService.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
      next: () => this.toastService.success('Login realizado com sucesso') ,
      error: () => this.toastService.error('Erro ao fazer login')
    })
  }

  navigate(){
    this.router.navigate(['/signup'])
  }
}
