// src/app/services/auth.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
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

  // ── Logout ──────────────────────────────────────────────────────────────────
  logout(): void {
    sessionStorage.clear();
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  // Verifica se há um token salvo na sessão
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('auth-token');
  }

  // Retorna true se o usuário logado é admin
  isAdmin(): boolean {
    return sessionStorage.getItem('isAdmin') === 'true';
  }

  // Retorna o token salvo
  getToken(): string | null {
    return sessionStorage.getItem('auth-token');
  }

  // Salva os dados da resposta do backend na sessionStorage
  private saveSession(response: AuthResponse): void {
    sessionStorage.setItem('auth-token', response.token);
    sessionStorage.setItem('username', response.username);
    sessionStorage.setItem('userId', response.userId.toString());
    sessionStorage.setItem('isAdmin', response.isAdmin.toString());
    sessionStorage.setItem('imgUrl', response.imgUrl);
  }
}