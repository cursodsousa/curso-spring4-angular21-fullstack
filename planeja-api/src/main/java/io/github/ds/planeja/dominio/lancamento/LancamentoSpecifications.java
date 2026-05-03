package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.dominio.lancamento.model.LancamentoEntity;
import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.time.YearMonth;
import java.util.UUID;

public class LancamentoSpecifications {

    private LancamentoSpecifications() {
    }

    public static Specification<LancamentoEntity> porFiltros(YearMonth mes, TipoLancamento tipo, UUID categoriaId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (mes != null) {
                var inicioMes = mes.atDay(1);
                var fimMes = mes.atEndOfMonth();
                predicates.add(cb.between(root.get("data"), inicioMes, fimMes));
            }

            if (tipo != null) {
                predicates.add(cb.equal(root.get("tipo"), tipo));
            }

            if (categoriaId != null) {
                predicates.add(cb.equal(root.get("categoria").get("id"), categoriaId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
