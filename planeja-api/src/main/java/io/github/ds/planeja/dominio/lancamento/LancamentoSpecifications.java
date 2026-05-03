package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.dominio.lancamento.model.LancamentoEntity;
import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import org.springframework.data.jpa.domain.Specification;

import java.time.YearMonth;
import java.util.UUID;

public class LancamentoSpecifications {

    private LancamentoSpecifications() {
    }

    public static Specification<LancamentoEntity> porFiltros(YearMonth mes, TipoLancamento tipo, UUID categoriaId) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (mes != null) {
                var inicioMes = mes.atDay(1);
                var fimMes = mes.atEndOfMonth();
                predicates.getExpressions().add(cb.between(root.get("data"), inicioMes, fimMes));
            }

            if (tipo != null) {
                predicates.getExpressions().add(cb.equal(root.get("tipo"), tipo));
            }

            if (categoriaId != null) {
                predicates.getExpressions().add(cb.equal(root.get("categoria").get("id"), categoriaId));
            }

            return predicates;
        };
    }
}
