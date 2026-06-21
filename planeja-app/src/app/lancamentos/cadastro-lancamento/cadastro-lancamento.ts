import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DadosLancamentoForm, TipoLancamento } from '../dados-lancamentos';
import { ToastrService } from 'ngx-toastr';
import { LancamentoService } from '../lancamento-service';
import { DetalhesCategoria } from '../../categorias/dados-categoria';
import { DetalhesCartao } from '../../cartoes/dados-cartao';
import { forkJoin } from 'rxjs'
import { Header } from "../../common/components/header/header";
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';
import { RouterModule } from '@angular/router';

interface CadastroLancamentoForm {
  categoriaId: FormControl<string>;
  descricao: FormControl<string>;
  data: FormControl<string>;
  valor: FormControl<string>;
  tipo: FormControl<TipoLancamento |''>;
  cartaoId: FormControl<string>;
}

@Component({
  selector: 'app-cadastro-lancamento',
  imports: [Header, ReactiveFormsModule, CommonModule, NgxMaskDirective, RouterModule],
  templateUrl: './cadastro-lancamento.html',
  styleUrl: './cadastro-lancamento.scss',
})
export class CadastroLancamento implements OnInit {
  form!: FormGroup<CadastroLancamentoForm>;
  toast = inject(ToastrService);
  service = inject(LancamentoService);

  categoriasAtivas: DetalhesCategoria[] = [];
  cartoesAtivos: DetalhesCartao[] = [];

  ngOnInit(): void {
    this.form = new FormGroup<CadastroLancamentoForm>({
      categoriaId: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      descricao: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      data: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      valor: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
      tipo: new FormControl<TipoLancamento | ''>('', { nonNullable: true, validators: Validators.required }),
      cartaoId: new FormControl<string>('', { nonNullable: true }),
    });

    this.inicializarDropDowns();
  }

  inicializarDropDowns(){
    forkJoin({
      categorias: this.service.listarCategoriasDisponiveis(),
      cartoes: this.service.listarCartoesDisponiveis()
    }).subscribe({
      next: (resultado) => {
        this.categoriasAtivas = resultado.categorias;
        this.cartoesAtivos = resultado.cartoes;
      },
      error: () => this.toast.error('Erro ao carregar categorias e cartoes')
    })
  }

  isDespesa() : boolean {
    return this.form.controls.tipo.value === 'DESPESA';
  }

  handleTipoChange(): void {
    if(!this.isDespesa()){
      this.form.controls.cartaoId.setValue('');
      this.form.controls.cartaoId.setErrors(null);
    }
  }

  isFormInvalid() : boolean {
    if(this.form.invalid){
      this.form.markAllAsTouched();
      this.toast.error('Erro de validação. Verifique os valores informados.');
      return true;
    }
    return false;
  }

  handleSubmit(){
    if(this.isFormInvalid()){
      return;
    }
    
    const dados = this.form.value as DadosLancamentoForm;
    dados.valor = this.parseValor(dados.valor);

    this.service.criar(dados).subscribe({
      next: () => {
        this.toast.success('Lançamento cadastrado com sucesso!');
        this.form.reset();
      },
      error: (error) => this.onApiError(error)
    })
  }

  private aplicarErrosValidacao(error: ValidationErrorResponse){
      error.camposInvalidos.forEach(ci => {
        const control = this.form.get(ci.campo);
        if(control){
          control.setErrors({ apiError: ci.erro });
          control.markAsTouched();
        }
      })
    }
  
    private onApiError(response: any) : void {
        if(response.status === 422){
          this.aplicarErrosValidacao(response.error);
          this.toast.error('Erro de validação. Verifique os valores informados.');
          return;
        }
        this.toast.error('Ocorreu um erro ao processar a requisição.');
        console.error(response.error);
    }

    private parseValor(valorMascarado: string) : string {
      if(!valorMascarado){
        return '';
      }
      // 1.000,50 -> 1000.50
      return valorMascarado.replace(/\./g, '').replace(',', '.');
    }
}
