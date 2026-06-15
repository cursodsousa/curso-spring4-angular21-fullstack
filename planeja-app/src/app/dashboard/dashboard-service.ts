import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardResumo } from './dados-dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/dashboard';

  obterResumoMesAtual(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(this.baseUrl);
  }
}
