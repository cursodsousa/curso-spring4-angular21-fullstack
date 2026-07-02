package io.github.ds.planeja.dominio.usuario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioCadastroForm(
        @NotBlank(message = "Informe o nome do usuário")
        String nome,
        @NotBlank(message = "Informe o login")
        String login,
        @NotBlank(message = "Informe a senha")
        @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres")
        String senha
) {
}
