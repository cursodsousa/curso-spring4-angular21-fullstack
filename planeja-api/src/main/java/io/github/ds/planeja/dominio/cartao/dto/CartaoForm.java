package io.github.ds.planeja.dominio.cartao.dto;

import io.github.ds.planeja.dominio.cartao.model.BandeiraCartao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Data Access Object
public record CartaoForm(
        @NotBlank(message = "Campo obrigatório.")
        String nome,
        @NotNull(message = "Campo obrigatório.")
        BandeiraCartao bandeira) {
}
