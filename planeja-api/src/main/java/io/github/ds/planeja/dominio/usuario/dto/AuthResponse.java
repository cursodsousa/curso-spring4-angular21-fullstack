package io.github.ds.planeja.dominio.usuario.dto;

public record AuthResponse(
        String token,
        String tipo,
        long expiraEm,
        String nome
) {
}
