package io.github.ds.planeja.dominio.lancamento.mapper;

import io.github.ds.planeja.dominio.cartao.model.CartaoEntity;
import io.github.ds.planeja.dominio.categoria.model.CategoriaEntity;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoDetalhes;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoForm;
import io.github.ds.planeja.dominio.lancamento.model.LancamentoEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class LancamentoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoria", source = "categoria")
    @Mapping(target = "cartao", source = "cartao")
    public abstract LancamentoEntity toEntity(LancamentoForm form, CategoriaEntity categoria, CartaoEntity cartao);

    @Mapping(target = "categoriaId", expression = "java(entity.getCategoria().getId().toString())")
    @Mapping(target = "categoriaNome", expression = "java(entity.getCategoria().getNome())")
    @Mapping(target = "cartaoId", expression = "java(entity.getCartao() != null ? entity.getCartao().getId().toString() : null)")
    @Mapping(target = "cartaoNome", expression = "java(entity.getCartao() != null ? entity.getCartao().getNome() : null)")
    public abstract LancamentoDetalhes toDetalhes(LancamentoEntity entity);
}
