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

    public ValidationResult validar(
            LancamentoForm form, CategoriaEntity categoria, CartaoEntity cartao){
        var result = ValidationResult.novo();

        if(categoria == null){
            result.add(new CampoInvalido("categoriaId", "Categoria não encontrada."));
        } else if(Boolean.FALSE.equals(categoria.getAtivo())){
            result.add(new CampoInvalido("categoriaId", "Categoria inativa."));
        }

        if(form.tipo() == TipoLancamento.RECEITA && cartao != null){
            result.add(new CampoInvalido(
                    "cartaoId", "Lancamento do tipo RECEITA não aceita cartão."));
        }

        if(form.tipo() == TipoLancamento.DESPESA && form.cartaoId() != null){
            if(cartao == null){
                result.add(new CampoInvalido("cartaoId", "Cartão não encontrado."));
            } else if(Boolean.FALSE.equals(cartao.getAtivo())){
                result.add(new CampoInvalido("cartaoId", "Cartão inativo."));
            }
        }

        return result;
    }
}
