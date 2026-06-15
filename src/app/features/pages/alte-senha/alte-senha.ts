import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service'; // Ajuste o caminho se necessário

interface ChangePasswordForm {
  code: FormControl<string | null>;
  newPassword: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-alte-senha',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './alte-senha.html',
  styleUrl: './alte-senha.scss',
})
export class AlteSenha implements OnInit {
  passwordForm!: FormGroup<ChangePasswordForm>;
  userEmail: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastrService
  ) {
    this.passwordForm = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.matchPasswords }); // Validador customizado para checar se as senhas são iguais
  }

  ngOnInit(): void {
    // Captura o e-mail que passamos na URL lá na tela de Login
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'] || '';
      
      // Se por acaso não tiver e-mail na URL, manda o usuário de volta pro login por segurança
      if (!this.userEmail) {
        this.toastService.warning('Sessão inválida. Por favor, reinicie o processo.');
        this.router.navigate(['/login']);
      }
    });
  }

  // Validador customizado para garantir que as senhas coincidem
  matchPasswords(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  submit() {
    if (this.passwordForm.invalid) {
      this.toastService.error('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const { code, newPassword } = this.passwordForm.value;

    this.toastService.info('Processando alteração...');

    // TODO: Criar esse método no seu AuthService do Angular depois
    this.authService.resetPassword(this.userEmail, code!, newPassword!).subscribe({
      next: () => {
        this.toastService.success('Senha alterada com sucesso! Faça login com a nova senha.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Código inválido ou expirado.');
      }
    });
  }
}