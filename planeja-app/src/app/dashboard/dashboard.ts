import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Header } from '../common/components/header/header';
import { DashboardService } from './dashboard-service';
import { DashboardResumo, DespesaCategoriaResumo } from './dados-dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  service = inject(DashboardService);
  dashboard$!: Observable<DashboardResumo>;

  ngOnInit(): void {
    this.dashboard$ = this.service.obterResumoMesAtual();
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  }

  formatarMes(mes: string): string {
    if (!mes) {
      return '';
    }

    const [ano, numeroMes] = mes.split('-').map(Number);
    const data = new Date(ano, numeroMes - 1, 1);

    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric'
    }).format(data);
  }

  percentual(valor: number, total: number): number {
    if (!total) {
      return 0;
    }

    return Math.round((valor / total) * 100);
  }

  maiorDespesaCategoria(despesas: DespesaCategoriaResumo[]): number {
    if (!despesas.length) {
      return 0;
    }

    return Math.max(...despesas.map(despesa => despesa.valor));
  }
}
