import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dashboard } from './dados-dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/dashboard';

  obterDashboardMesAtual() : Observable<Dashboard> {
    return this.http.get<Dashboard>(this.baseUrl);
  }
}
