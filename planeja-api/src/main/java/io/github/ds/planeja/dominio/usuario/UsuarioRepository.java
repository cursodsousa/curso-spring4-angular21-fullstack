package io.github.ds.planeja.dominio.usuario;

import io.github.ds.planeja.dominio.usuario.model.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, UUID> {

    Optional<UsuarioEntity> findByLogin(String login);

    boolean existsByLogin(String login);
}
