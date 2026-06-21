import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DadosLancamentoForm, DetalhesLancamento, FiltroLancamento } from './dados-lancamentos';
import { Observable } from 'rxjs';
import { DetalhesCategoria } from '../categorias/dados-categoria';
import { DetalhesCartao } from '../cartoes/dados-cartao'
import { PageResult } from '../common/pagination/page-result';

@Injectable({
  providedIn: 'root',
})
export class LancamentoService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/lancamentos';

  criar(dados: DadosLancamentoForm) : Observable<DetalhesLancamento> {
    return this.http.post<DetalhesLancamento>(this.baseUrl, dados);
  }

  listarCategoriasDisponiveis() : Observable<DetalhesCategoria[]> {
    return this.http.get<DetalhesCategoria[]>(`${this.baseUrl}/categorias-disponiveis`);
  }

  listarCartoesDisponiveis() : Observable<DetalhesCartao[]> {
    return this.http.get<DetalhesCartao[]>(`${this.baseUrl}/cartoes-disponiveis`);
  }

  listar(filtros: FiltroLancamento) : Observable<PageResult<DetalhesLancamento>> {
    let params = new HttpParams();

    if(filtros.mes){
      params = params.set('mes', filtros.mes);
    }

    if(filtros.tipo){
      params = params.set('tipo', filtros.tipo);
    }

    if(filtros.categoriaId){
      params = params.set('categoria-id', filtros.categoriaId);
    }

    let page = filtros.page ?? 0;
    let size = filtros.size ?? 10;

    params = params.set('page', page).set('size', size);

    return this.http.get<PageResult<DetalhesLancamento>>(this.baseUrl, { params })
  }

  listarCategoriasParaFiltrar() : Observable<DetalhesCategoria[]> {
    return this.http.get<DetalhesCategoria[]>(`${this.baseUrl}/categorias-listagem`);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
