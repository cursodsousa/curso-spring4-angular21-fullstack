package io.github.ds.planeja.dominio.lancamento.dto;

import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record LancamentoForm(
        @NotNull(message = "Campo obrigatÃ³rio.")
        UUID categoriaId,
        @NotNull(message = "Campo obrigatÃ³rio.")
        LocalDate data,
        @NotNull(message = "Campo obrigatÃ³rio.")
        @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero.")
        BigDecimal valor,
        @NotNull(message = "Campo obrigatÃ³rio.")
        TipoLancamento tipo,
        UUID cartaoId
) {
}
