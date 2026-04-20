import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../categoria-service';
import { DadosCategoriaForm } from '../dados-categoria';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';

interface CadastroCategoriaForm {
  descricao: FormControl<string>;
}

@Component({
  selector: 'app-cadastro-categoria',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './cadastro-categoria.html',
  styleUrl: './cadastro-categoria.scss',
})
export class CadastroCategoria implements OnInit {

  form!: FormGroup<CadastroCategoriaForm>;
  service = inject(CategoriaService);
  toast = inject(ToastrService);

  ngOnInit(): void {
    this.form = new FormGroup<CadastroCategoriaForm>({
      descricao: new FormControl('', { nonNullable: true, validators: Validators.required }),
    });
  }

  isFormInvalid(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Erro de validação. Verifique os valores informados.');
      return true;
    }
    return false;
  }

  handleSubmit() {
    if (this.isFormInvalid()) {
      return;
    }

    const dadosCategoria = this.form.value as DadosCategoriaForm;

    this.service
      .criar(dadosCategoria)
      .subscribe({
        next: () => {
          this.toast.success('Categoria cadastrada com sucesso!');
          this.form.reset();
        },
        error: (error) => this.onApiError(error),
      });
  }

  private aplicarErrosValidacao(error: ValidationErrorResponse) {
    error.camposInvalidos.forEach(ci => {
      const control = this.form.get(ci.campo);
      if (control) {
        control.setErrors({ apiError: ci.erro });
        control.markAsTouched();
      }
    });
  }

  private onApiError(response: any): void {
    if (response.status === 422) {
      this.aplicarErrosValidacao(response.error);
      this.toast.error('Erro de validação. Verifique os valores informados.');
      return;
    }

    this.toast.error('Ocorreu um erro ao processar a requisição.');
    console.error(response.error);
  }
}
