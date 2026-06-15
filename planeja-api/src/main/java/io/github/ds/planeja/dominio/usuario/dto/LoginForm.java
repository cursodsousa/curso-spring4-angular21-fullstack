package io.github.ds.planeja.dominio.usuario.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginForm(
        @NotBlank(message = "Informe o login.")
        String login,

        @NotBlank(message = "Informe a senha.")
        String senha
) {
}
