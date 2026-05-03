import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResult } from '../common/pagination/page-result';
import { DadosLancamentoForm, DetalhesLancamento, FiltroLancamento } from './dados-lancamento';
import { DetalhesCategoria } from '../categorias/dados-categoria';
import { DetalhesCartao } from '../cartoes/dados-cartao';

@Injectable({
  providedIn: 'root',
})
export class LancamentoService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/lancamentos';

  criar(dados: DadosLancamentoForm): Observable<DetalhesLancamento> {
    return this.http.post<DetalhesLancamento>(this.baseUrl, dados);
  }

  listarCategoriasDisponiveis(): Observable<DetalhesCategoria[]> {
    return this.http.get<DetalhesCategoria[]>(`${this.baseUrl}/categorias-disponiveis`);
  }

  listarCartoesDisponiveis(): Observable<DetalhesCartao[]> {
    return this.http.get<DetalhesCartao[]>(`${this.baseUrl}/cartoes-disponiveis`);
  }

  listar(filtros: FiltroLancamento): Observable<PageResult<DetalhesLancamento>> {
    let params = new HttpParams()
      .set('page', (filtros.page ?? 0).toString())
      .set('size', (filtros.size ?? 10).toString());

    if (filtros.mes) {
      params = params.set('mes', filtros.mes);
    }

    if (filtros.tipo) {
      params = params.set('tipo', filtros.tipo);
    }

    if (filtros.categoriaId) {
      params = params.set('categoriaId', filtros.categoriaId);
    }

    return this.http.get<PageResult<DetalhesLancamento>>(this.baseUrl, { params });
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
