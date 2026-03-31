import { Component, OnInit, inject } from '@angular/core';
import { CartaoService } from '../cartao-service';
import { Observable } from 'rxjs';
import { PageResult } from '../../common/pagination/page-result';
import { DetalhesCartao } from '../dados-cartao';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listagem-cartoes',
  imports: [CommonModule],
  templateUrl: './listagem-cartoes.html',
  styleUrl: './listagem-cartoes.scss',
})
export class ListagemCartoes implements OnInit {

  service = inject(CartaoService);
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
}
