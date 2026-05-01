package io.github.ds.planeja.dominio.categoria.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoriaForm(
        @NotBlank(message = "Campo obrigatório.") String nome) {
}
