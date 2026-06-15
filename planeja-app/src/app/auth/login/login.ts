import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-service';
import { CadastroUsuarioForm, LoginForm } from '../dados-auth';

interface AuthForm {
  nome: FormControl<string>;
  login: FormControl<string>;
  senha: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  form!: FormGroup<AuthForm>;
  modo: 'login' | 'cadastro' = 'login';

  authService = inject(AuthService);
  router = inject(Router);
  toast = inject(ToastrService);

  ngOnInit(): void {
    this.form = new FormGroup<AuthForm>({
      nome: new FormControl('', { nonNullable: true }),
      login: new FormControl('', { nonNullable: true, validators: Validators.required }),
      senha: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    });

    if (this.authService.isAutenticado()) {
      this.router.navigate(['/paginas/dashboard']);
    }
  }

  alterarModo(modo: 'login' | 'cadastro'): void {
    this.modo = modo;

    if (modo === 'cadastro') {
      this.form.controls.nome.setValidators(Validators.required);
    } else {
      this.form.controls.nome.clearValidators();
    }

    this.form.controls.nome.updateValueAndValidity();
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Verifique os dados informados.');
      return;
    }

    if (this.modo === 'cadastro') {
      const dados = this.form.value as CadastroUsuarioForm;
      this.authService.cadastrar(dados).subscribe({
        next: () => this.onAuthSuccess(),
        error: response => this.onAuthError(response)
      });
      return;
    }

    const dados = this.form.value as LoginForm;
    this.authService.login(dados).subscribe({
      next: () => this.onAuthSuccess(),
      error: response => this.onAuthError(response)
    });
  }

  private onAuthSuccess(): void {
    this.router.navigate(['/paginas/dashboard']);
  }

  private onAuthError(response: any): void {
    if (response.status === 401) {
      this.toast.error('Login ou senha inválidos.');
      return;
    }

    if (response.status === 422) {
      this.toast.error('Verifique os dados informados.');
      return;
    }

    this.toast.error('Ocorreu um erro ao autenticar.');
  }
}
