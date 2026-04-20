package io.github.ds.planeja.dominio.categoria.mapper;

import io.github.ds.planeja.dominio.categoria.dto.CategoriaDetalhes;
import io.github.ds.planeja.dominio.categoria.dto.CategoriaForm;
import io.github.ds.planeja.dominio.categoria.model.CategoriaEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {

    CategoriaEntity toEntity(CategoriaForm form);

    CategoriaDetalhes toDetalhes(CategoriaEntity entity);
}
