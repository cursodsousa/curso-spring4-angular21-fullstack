package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.common.validation.CampoInvalido;
import io.github.ds.planeja.common.validation.ValidationResult;
import io.github.ds.planeja.dominio.cartao.model.CartaoEntity;
import io.github.ds.planeja.dominio.categoria.model.CategoriaEntity;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoForm;
import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import org.springframework.stereotype.Component;

@Component
public class LancamentoValidator {

    public ValidationResult validar(LancamentoForm form, CategoriaEntity categoria, CartaoEntity cartao) {
        var result = ValidationResult.novo();

        if (categoria == null) {
            result.add(new CampoInvalido("categoriaId", "Categoria nao encontrada."));
        } else if (!Boolean.TRUE.equals(categoria.getAtivo())) {
            result.add(new CampoInvalido("categoriaId", "Categoria inativa."));
        }

        if (form.tipo() == TipoLancamento.RECEITA && form.cartaoId() != null) {
            result.add(new CampoInvalido("cartaoId", "Lancamento do tipo RECEITA nao aceita cartao."));
        }

        if (form.tipo() == TipoLancamento.DESPESA && form.cartaoId() != null) {
            if (cartao == null) {
                result.add(new CampoInvalido("cartaoId", "Cartao nao encontrado."));
            } else if (!Boolean.TRUE.equals(cartao.getAtivo())) {
                result.add(new CampoInvalido("cartaoId", "Cartao inativo."));
            }
        }

        return result;
    }
}
