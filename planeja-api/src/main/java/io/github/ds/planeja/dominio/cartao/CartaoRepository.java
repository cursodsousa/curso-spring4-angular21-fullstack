package io.github.ds.planeja.dominio.cartao;

import io.github.ds.planeja.dominio.cartao.model.CartaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartaoRepository extends JpaRepository<CartaoEntity, UUID> {

    Optional<CartaoEntity> findByNome(String nome);

    @Query("""
        select c 
        from CartaoEntity c
        where ( :id is null or c.id != :id )
            and c.nome = :nome
    """)
    List<CartaoEntity> findByNomeAndNotId(
            @Param("nome") String nome, @Param("id") UUID id);
}
