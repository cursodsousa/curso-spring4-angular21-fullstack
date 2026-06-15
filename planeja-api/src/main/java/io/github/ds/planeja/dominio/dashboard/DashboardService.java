package io.github.ds.planeja.dominio.dashboard;

import io.github.ds.planeja.dominio.dashboard.dto.DashboardResumo;
import io.github.ds.planeja.dominio.dashboard.dto.DespesaCategoriaResumo;
import io.github.ds.planeja.dominio.dashboard.dto.ResumoFinanceiro;
import io.github.ds.planeja.dominio.lancamento.LancamentoRepository;
import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private LancamentoRepository lancamentoRepository;

    public DashboardResumo obterResumoMesAtual() {
        YearMonth mesAtual = YearMonth.now();
        LocalDate inicio = mesAtual.atDay(1);
        LocalDate fim = mesAtual.atEndOfMonth();

        BigDecimal receitas = lancamentoRepository.somarPorTipoNoPeriodo(TipoLancamento.RECEITA, inicio, fim);
        BigDecimal despesas = lancamentoRepository.somarPorTipoNoPeriodo(TipoLancamento.DESPESA, inicio, fim);
        BigDecimal saldo = receitas.subtract(despesas);

        List<DespesaCategoriaResumo> despesasPorCategoria = lancamentoRepository
                .somarPorCategoriaNoPeriodo(TipoLancamento.DESPESA, inicio, fim)
                .stream()
                .map(resultado -> new DespesaCategoriaResumo(
                        (String) resultado[0],
                        (BigDecimal) resultado[1]
                ))
                .toList();

        return new DashboardResumo(
                mesAtual.toString(),
                new ResumoFinanceiro(receitas, despesas, saldo),
                despesasPorCategoria
        );
    }
}
