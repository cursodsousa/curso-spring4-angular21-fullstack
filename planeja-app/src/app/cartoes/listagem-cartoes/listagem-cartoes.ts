import { Component, OnInit, inject } from '@angular/core';
import { CartaoService } from '../cartao-service';
import { Observable } from 'rxjs';
import { PageResult } from '../../common/pagination/page-result';
import { DetalhesCartao } from '../dados-cartao';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listagem-cartoes',
  imports: [CommonModule, RouterModule],
  templateUrl: './listagem-cartoes.html',
  styleUrl: './listagem-cartoes.scss',
})
export class ListagemCartoes implements OnInit {

  service = inject(CartaoService);
  router = inject(Router);
  toast = inject(ToastrService);
  listagem$!: Observable<PageResult<DetalhesCartao>>;
  paginaAtual = 0;
  tamanhoPagina = 5;

  ngOnInit(): void {
    this.listarCartoes();
  }

  listarCartoes(){
    this.listagem$ = this.service.listar(this.paginaAtual, this.tamanhoPagina);
  }

  navegar(pagina: number){
    this.paginaAtual = pagina;
    this.listarCartoes();
  }

  navegarAnterior(listagem: PageResult<DetalhesCartao>){
    if (!listagem.first) {
      this.navegar(listagem.number - 1);
    }
  }

  navegarProximo(listagem: PageResult<DetalhesCartao>){
    if (!listagem.last) {
      this.navegar(listagem.number + 1);
    }
  }

  paginas(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  inicioRegistro(listagem: PageResult<DetalhesCartao>): number {
    if (listagem.totalElements === 0) {
      return 0;
    }

    return (listagem.number * listagem.size) + 1;
  }

  fimRegistro(listagem: PageResult<DetalhesCartao>): number {
    if (listagem.totalElements === 0) {
      return 0;
    }

    return Math.min((listagem.number + 1) * listagem.size, listagem.totalElements);
  }

  mudarStatus(idCartao: string){
    this.service.mudarStatus(idCartao)
      .subscribe(next => {
        this.toast.success('Registro atualizado com sucesso!');
        this.listarCartoes();
      })
  }

  prepararEdicao(idCartao: string){
    this.router.navigate(['/paginas/cadastro-cartoes'], { queryParams: { id: idCartao} })
  }
}
