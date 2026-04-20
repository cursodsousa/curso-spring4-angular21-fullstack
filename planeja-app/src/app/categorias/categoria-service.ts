import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DadosCategoriaForm, DetalhesCategoria } from './dados-categoria';
import { PageResult } from '../common/pagination/page-result';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/categorias';

  criar(dados: DadosCategoriaForm): Observable<DetalhesCategoria> {
    return this.http.post<DetalhesCategoria>(this.baseUrl, dados);
  }

  listar(page: number = 0, size: number = 10): Observable<PageResult<DetalhesCategoria>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PageResult<DetalhesCategoria>>(url);
  }

  mudarStatus(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, null);
  }
}
