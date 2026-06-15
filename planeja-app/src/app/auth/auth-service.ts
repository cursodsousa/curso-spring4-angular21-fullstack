import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, CadastroUsuarioForm, LoginForm } from './dados-auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'planeja_token';
  private readonly nomeKey = 'planeja_usuario_nome';
  private logoutTimer?: ReturnType<typeof setTimeout>;

  http = inject(HttpClient);
  router = inject(Router);
  baseUrl = 'http://localhost:8080/auth';

  login(dados: LoginForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, dados)
      .pipe(tap(response => this.salvarSessao(response)));
  }

  cadastrar(dados: CadastroUsuarioForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/cadastro`, dados)
      .pipe(tap(response => this.salvarSessao(response)));
  }

  salvarSessao(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.nomeKey, response.nome);
    this.agendarLogoutPorExpiracao();
  }

  iniciarSessaoSalva(): void {
    if (this.isTokenExpirado()) {
      this.logout(false);
      return;
    }

    this.agendarLogoutPorExpiracao();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAutenticado(): boolean {
    return !!this.getToken() && !this.isTokenExpirado();
  }

  isTokenExpirado(): boolean {
    const exp = this.getTokenExpiration();
    if (!exp) {
      return true;
    }

    return Date.now() >= exp * 1000;
  }

  logout(redirecionar = true): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.nomeKey);

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    if (redirecionar) {
      this.router.navigate(['/login']);
    }
  }

  private agendarLogoutPorExpiracao(): void {
    const exp = this.getTokenExpiration();
    if (!exp) {
      return;
    }

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    const tempoRestante = (exp * 1000) - Date.now();
    if (tempoRestante <= 0) {
      this.logout();
      return;
    }

    this.logoutTimer = setTimeout(() => this.logout(), tempoRestante);
  }

  private getTokenExpiration(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')));
      return payload.exp;
    } catch {
      return null;
    }
  }
}
