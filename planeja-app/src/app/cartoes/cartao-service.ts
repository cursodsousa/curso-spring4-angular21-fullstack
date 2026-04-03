import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DadosCartaoForm, DetalhesCartao } from './dados-cartao'
import { Observable } from 'rxjs';
import { PageResult } from '../common/pagination/page-result';

@Injectable({
  providedIn: 'root',
})
export class CartaoService {
  
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/cartoes';

  criar(dados: DadosCartaoForm) : Observable<DetalhesCartao> {
    return this.http.post<DetalhesCartao>(this.baseUrl, dados);
  }

  listar(page: number = 0, size: number = 10) : Observable<PageResult<DetalhesCartao>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PageResult<DetalhesCartao>>(url);
  }

  mudarStatus(idCartao: string) : Observable<void>{
    return this.http.patch<void>(`${this.baseUrl}/${idCartao}/status`, null);
  }

  obterPorId(id: string): Observable<DetalhesCartao> {
    return this.http.get<DetalhesCartao>(`${this.baseUrl}/${id}`);
  }

  atualizar(id: string, dados: DadosCartaoForm) : Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dados);
  }
}
