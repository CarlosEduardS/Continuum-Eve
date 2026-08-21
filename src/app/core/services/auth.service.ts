import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap, map, Observable, catchError, of } from 'rxjs';
import { AuthResponse } from '../../shared/types/auth-response.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  IsAdmin = false;
  private http = inject(HttpClient);

  // URL base do Adan-Stella
  // Em produção, troca pelo endereço real do backend deployado
  private readonly apiUrl = 'http://localhost:5171/api/auth';

  // ── Register ────────────────────────────────────────────────────────────────
  register(username: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { username, email, password })
      .pipe(
        tap((response) => {
          // Salva o token e dados do usuário na sessão
          this.saveSession(response);
        })
      );
  }

  // ── Login ───────────────────────────────────────────────────────────────────
  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          this.saveSession(response);
        })
      );
  }

  // ── Check Email Exists ──────────────────────────────────────────────────────
  // Envia o e-mail para o backend validar se já existe no banco de dados
  checkEmailExists(email: string): Observable<boolean> {
    return this.http
      .post<{ exists: boolean }>(`${this.apiUrl}/check-email`, { email })
      .pipe(
        map(response => response.exists),
        catchError(() => {
          // Caso o backend retorne um erro (como 404), tratamos como falso com segurança
          return of(false);
        })
      );
  }

  // ── Reset Password ──────────────────────────────────────────────────────────
  // Envia os dados para redefinir a senha do usuário
  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      email,
      code,
      newPassword
    });
  }

  // ── Logout ──────────────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('imgUrl');
    localStorage.removeItem('dateCreate');
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  // Verifica se há um token salvo no navegador
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth-token');
  }

  // Retorna true se o usuário logado é admin
  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  // Retorna o token salvo
  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  // Salva os dados da resposta do backend no navegador
  private saveSession(response: AuthResponse): void {
    localStorage.setItem('auth-token', response.token);
    localStorage.setItem('username', response.username);
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('isAdmin', response.isAdmin.toString());
    localStorage.setItem('imgUrl', response.imgUrl);
    localStorage.setItem('dateCreate', response.createAt);
  }
}