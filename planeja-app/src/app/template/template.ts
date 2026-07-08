import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-template',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './template.html',
  styleUrl: './template.scss'
})
export class Template {
  authService = inject(AuthService);

  sair(){
    this.authService.logout(true);
  }
}
