import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartaoService } from '../cartao-service';
import { DadosCartaoForm, DetalhesCartao } from '../dados-cartao';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

interface CadastroCartaoForm {
  nome: FormControl<string>;
  bandeira: FormControl<string>;
}

@Component({
  selector: 'app-cadastro-cartao',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './cadastro-cartao.html',
  styleUrl: './cadastro-cartao.scss',
})
export class CadastroCartao implements OnInit {

  form!: FormGroup<CadastroCartaoForm>;
  service = inject(CartaoService);
  toast = inject(ToastrService);
  rotaAtiva = inject(ActivatedRoute);
  idCartaoEdicao?: string;

  ngOnInit(): void {
    this.form = new FormGroup<CadastroCartaoForm>({
      nome: new FormControl('', { nonNullable: true, validators: Validators.required }),
      bandeira: new FormControl('', { nonNullable: true, validators: Validators.required })
    });

    this.carregaDadosParaEdicao();
  }

  carregaDadosParaEdicao(){
    this.idCartaoEdicao = this.rotaAtiva.snapshot.queryParamMap.get('id') || '';

    if(!this.idCartaoEdicao){
      return;
    }

    this.service
      .obterPorId(this.idCartaoEdicao)
      .subscribe({
        next: (cartao) => {
          this.form.patchValue({
            nome: cartao.nome,
            bandeira: cartao.bandeira
          });
        },
        error: () => {
          this.toast.error('Erro ao carregar dados do cartão.');
        }
      });
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

    const dadosCartao = this.form.value as DadosCartaoForm;

    const request: Observable<DetalhesCartao | void> = this.idCartaoEdicao
        ? this.service.atualizar(this.idCartaoEdicao, dadosCartao)
        : this.service.criar(dadosCartao);
    
    request
        .subscribe({
          next: (response) => {
            this.toast.success('Cartão cadastrado/atualizado com sucesso!');
          },
          error: (error) => this.onApiError(error)
        });
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
}
