package io.github.ds.planeja.dominio.categoria.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "categoria")
@Getter
@Setter
public class CategoriaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column
    private UUID id;

    @Column(name = "descricao", nullable = false, length = 60)
    private String descricao;

    @Column(name = "ativo")
    private Boolean ativo = true;
}
