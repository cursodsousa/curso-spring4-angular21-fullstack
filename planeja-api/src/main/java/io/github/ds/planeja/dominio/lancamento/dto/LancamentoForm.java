package io.github.ds.planeja.dominio.lancamento.dto;

import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record LancamentoForm(
        @NotNull(message = "Campo obrigatório.")
        UUID categoriaId,
        @NotNull(message = "Campo obrigatório.")
        TipoLancamento tipo,
        @NotNull(message = "Campo obrigatório.")
        LocalDate data,
        @NotNull(message = "Campo obrigatório.")
        @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero.")
        BigDecimal valor,
        UUID cartaoId
) {
}
