package io.github.ds.planeja.dominio.usuario.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "usuario")
@Data
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "login", unique = true, nullable = false)
    private String login;

    @Column(name= "senha", nullable = false)
    private String senha;

    @Column(name = "nome", nullable = false)
    private String nome;
}
