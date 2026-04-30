import { Component } from '@angular/core';
import { DefaultLoginLayout } from "../../../shared/layout/default-login-layout/default-login-layout";
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { PrimaryInput } from "../../../shared/ui/primary-input/primary-input";
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/login';
import { ToastrService } from 'ngx-toastr';

interface SignupForm {
  name: FormControl;
  email: FormControl;
  password: FormControl;
  passwordConfirme: FormControl;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  providers: [LoginService],
  imports: [DefaultLoginLayout, ReactiveFormsModule, PrimaryInput],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  SignupForm!: FormGroup<SignupForm>;
  errorMessage = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.SignupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirme: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  submit(){
    if (this.SignupForm.value.passwordConfirme !== this.SignupForm.value.password) {
      this.errorMessage = 'As senhas não coincidem.';
    } else {
      this.errorMessage = 'Erro ao criar conta. Tente novamente mais tarde.';
    }
    this.loginService.login(this.SignupForm.value.email!, this.SignupForm.value.password!).subscribe({
      next: () => this.toastService.success('Conta criada com sucesso!'),
      error: () => this.toastService.error(this.errorMessage)
    })
  }

  navigate(){
    this.router.navigate(['/login'])
  }
}
