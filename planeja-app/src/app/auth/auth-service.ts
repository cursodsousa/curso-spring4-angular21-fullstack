import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse, CadastroUsuarioForm, LoginForm } from './dados-auth';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'
import { Router } from '@angular/router';

interface JwtPayload {
  exp?: number;
  nome?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly token_key = 'token_sessao';
  private readonly nome_usuario_key = 'nome_usuario_sessao';
  private logoutTimer?: ReturnType<typeof setTimeout>;

  http = inject(HttpClient);
  router = inject(Router);
  baseUrl = 'http://localhost:8080/auth'

  login(dados: LoginForm) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signin`, dados)
          .pipe(tap(response => this.salvarSessao(response)))
    ;
  }

  cadastrar(dados: CadastroUsuarioForm) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, dados)
      .pipe(tap(response => this.salvarSessao(response)));
  }

  salvarSessao(response: AuthResponse){
    const token = response.token;
    localStorage.setItem(this.token_key, token);
    localStorage.setItem(this.nome_usuario_key, response.nome);
    this.agendarLogoutPorExpiracao();
  }

  iniciarSessaoSalva(){
    if(this.isTokenExpirado()){
      this.logout(false);
      return;
    }

    this.agendarLogoutPorExpiracao();
  }

  getToken() : string | null {
    return localStorage.getItem(this.token_key);
  }

  isAutenticado() : boolean {
    if(!this.getToken()){
      return false;
    }

    return !this.isTokenExpirado();
  }

  isTokenExpirado() : boolean {
    const exp = this.getTokenExpiration();
    if(!exp){
      return true;
    }

    return Date.now() >= exp * 1000;
  }

  logout(redirecionar = true) : void {
    localStorage.removeItem(this.token_key);
    localStorage.removeItem(this.nome_usuario_key);

    if(this.logoutTimer){
      clearTimeout(this.logoutTimer);
    }

    if(redirecionar){
      this.router.navigate(['/login']);
    }
  }

  agendarLogoutPorExpiracao(){
    const exp = this.getTokenExpiration();
    if(!exp){
      return;
    }

    if(this.logoutTimer){
      clearTimeout(this.logoutTimer);
    }

    const tempoRestante = (exp * 1000) - Date.now();

    if(tempoRestante <= 0){
      this.logout();
      return;
    }

    this.logoutTimer = setTimeout(() => this.logout(), tempoRestante);
  }

  getTokenExpiration() : number | null {
    const token = this.getToken();
    if(!token){
      return null;
    }

    try {
      const payload = jwtDecode<JwtPayload>(token);
      if(!payload.exp){
        return null;
      }
      return payload.exp;
    } catch {
      return null;
    }
  }
}
