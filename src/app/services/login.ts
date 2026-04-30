import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000'; // Configure com sua URL da API

  constructor(private httpClient: HttpClient) {}

  login(name: string, password: string) {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, { name, password }).pipe(tap((value) => {
      sessionStorage.setItem('auth-token', value.token);
      sessionStorage.setItem('username', value.name);
    }))
  }
}
