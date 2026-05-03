export type TipoLancamento = 'RECEITA' | 'DESPESA';

export class DadosLancamentoForm {
    categoriaId!: string;
    data!: string;
    valor!: number;
    tipo!: TipoLancamento;
    cartaoId?: string | null;
}

export class DetalhesLancamento {
    id!: string;
    data!: string;
    valor!: number;
    tipo!: TipoLancamento;
    categoriaId!: string;
    categoriaNome!: string;
    cartaoId!: string | null;
    cartaoNome!: string | null;
}

export interface FiltroLancamento {
    mes?: string;
    tipo?: TipoLancamento;
    categoriaId?: string;
    page?: number;
    size?: number;
}
