export class ResumoFinanceiro {
    receitas!: number;
    despesas!: number;
    saldo!: number;
}

export class DespesaCategoriaResumo {
    categoria!: string;
    valor!: number;
}

export class DashboardResumo {
    mes!: string;
    resumo!: ResumoFinanceiro;
    despesasPorCategoria!: DespesaCategoriaResumo[];
}
