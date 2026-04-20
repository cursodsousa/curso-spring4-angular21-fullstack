package io.github.ds.planeja.dominio.categoria;

import io.github.ds.planeja.dominio.categoria.model.CategoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CategoriaRepository extends JpaRepository<CategoriaEntity, UUID> {

    @Query("""
        select c
        from CategoriaEntity c
        where ( :id is null or c.id != :id )
            and c.descricao = :descricao
    """)
    List<CategoriaEntity> findByDescricaoAndNotId(
            @Param("descricao") String descricao, @Param("id") UUID id);
}
