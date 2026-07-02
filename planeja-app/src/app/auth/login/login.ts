import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
      nome: new FormControl<string>('', { nonNullable: true}),
      login: new FormControl<string>('', { nonNullable: true, validators: Validators.required}),
      senha: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.min(6)]}),
    });
  }

  alterarModo(modo: 'login' | 'cadastro') : void {
    this.modo = modo;

    if(modo === 'cadastro'){
      this.form.controls.nome.setValidators(Validators.required);
    } else {
      this.form.controls.nome.clearValidators();
    }

    this.form.controls.nome.updateValueAndValidity();
  }

  handleSubmit() : void {
    console.log(this.form.value);
  }
}
