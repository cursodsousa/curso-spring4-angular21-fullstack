import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { Header } from '../../common/components/header/header';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';
import { CategoriaService } from '../../categorias/categoria-service';
import { DetalhesCategoria } from '../../categorias/dados-categoria';
import { CartaoService } from '../../cartoes/cartao-service';
import { DetalhesCartao } from '../../cartoes/dados-cartao';
import { DadosLancamentoForm, TipoLancamento } from '../dados-lancamento';
import { LancamentoService } from '../lancamento-service';

interface CadastroLancamentoForm {
  categoriaId: FormControl<string>;
  data: FormControl<string>;
  valor: FormControl<string>;
  tipo: FormControl<TipoLancamento | ''>;
  cartaoId: FormControl<string>;
}

@Component({
  selector: 'app-cadastro-lancamento',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, Header, NgxMaskDirective],
  templateUrl: './cadastro-lancamento.html',
  styleUrl: './cadastro-lancamento.scss',
})
export class CadastroLancamento implements OnInit {
  form!: FormGroup<CadastroLancamentoForm>;
  toast = inject(ToastrService);
  lancamentoService = inject(LancamentoService);
  categoriaService = inject(CategoriaService);
  cartaoService = inject(CartaoService);

  categoriasAtivas: DetalhesCategoria[] = [];
  cartoesAtivos: DetalhesCartao[] = [];

  ngOnInit(): void {
    this.form = new FormGroup<CadastroLancamentoForm>({
      categoriaId: new FormControl('', { nonNullable: true, validators: Validators.required }),
      data: new FormControl('', { nonNullable: true, validators: Validators.required }),
      valor: new FormControl('', { nonNullable: true, validators: Validators.required }),
      tipo: new FormControl<TipoLancamento | ''>('', { nonNullable: true, validators: Validators.required }),
      cartaoId: new FormControl('', { nonNullable: true }),
    });

    this.carregarDropdowns();
  }

  carregarDropdowns(): void {
    forkJoin({
      categorias: this.categoriaService.listar(0, 200),
      cartoes: this.cartaoService.listar(0, 200),
    }).subscribe({
      next: ({ categorias, cartoes }) => {
        this.categoriasAtivas = categorias.content.filter((c) => c.ativo);
        this.cartoesAtivos = cartoes.content.filter((c) => c.ativo);
      },
      error: () => this.toast.error('Erro ao carregar categorias e cartoes.'),
    });
  }

  isDespesa(): boolean {
    return this.form.controls.tipo.value === 'DESPESA';
  }

  handleTipoChange(): void {
    if (!this.isDespesa()) {
      this.form.controls.cartaoId.setValue('');
      this.form.controls.cartaoId.setErrors(null);
    }
  }

  isFormInvalid(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Erro de validacao. Verifique os valores informados.');
      return true;
    }
    return false;
  }

  handleSubmit(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const valor = this.parseValor(this.form.controls.valor.value);
    if (valor <= 0) {
      this.form.controls.valor.setErrors({ min: true });
      this.form.controls.valor.markAsTouched();
      this.toast.error('Erro de validacao. Verifique os valores informados.');
      return;
    }
    const cartaoId = this.form.controls.cartaoId.value || null;
    const tipo = this.form.controls.tipo.value as TipoLancamento;

    const dados: DadosLancamentoForm = {
      categoriaId: this.form.controls.categoriaId.value,
      data: this.form.controls.data.value,
      valor,
      tipo,
      cartaoId: tipo === 'DESPESA' ? cartaoId : null,
    };

    this.lancamentoService.criar(dados).subscribe({
      next: () => {
        this.toast.success('Lancamento cadastrado com sucesso!');
        this.form.reset();
      },
      error: (error) => this.onApiError(error),
    });
  }

  private aplicarErrosValidacao(error: ValidationErrorResponse): void {
    error.camposInvalidos.forEach((ci) => {
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
      this.toast.error('Erro de validacao. Verifique os valores informados.');
      return;
    }

    this.toast.error('Ocorreu um erro ao processar a requisicao.');
  }

  private parseValor(valorMascarado: string): number {
    if (!valorMascarado) {
      return 0;
    }
    const normalizado = valorMascarado.replace(/\./g, '').replace(',', '.');
    return Number(normalizado);
  }
}
