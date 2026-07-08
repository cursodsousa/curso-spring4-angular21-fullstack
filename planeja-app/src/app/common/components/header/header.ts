import { Component, inject, input, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  titulo = input.required<string>();
  authService = inject(AuthService);
  nomeUsuarioLogado = 'Usuário';

  ngOnInit(): void {
    this.nomeUsuarioLogado = this.authService.getNomeUsuarioLogado() ?? 'Usuário';
  }
}
