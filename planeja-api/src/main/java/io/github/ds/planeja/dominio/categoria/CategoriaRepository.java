package io.github.ds.planeja.dominio.categoria;

import io.github.ds.planeja.dominio.categoria.dto.CategoriaDetalhes;
import io.github.ds.planeja.dominio.categoria.model.CategoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoriaRepository extends JpaRepository<CategoriaEntity, UUID> {

    boolean existsByNome(String nome);

    List<CategoriaEntity> findByAtivoTrue();
}
