package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.dominio.lancamento.dto.LancamentoDetalhes;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoForm;
import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@RestController
@RequestMapping("lancamentos")
@CrossOrigin("*")
public class LancamentoController {

    @Autowired
    private LancamentoService service;

    @PostMapping
    public ResponseEntity<LancamentoDetalhes> criar(@RequestBody @Valid LancamentoForm novo) {
        var detalhes = service.criar(novo);
        return ResponseEntity.status(HttpStatus.CREATED).body(detalhes);
    }

    @GetMapping
    public Page<LancamentoDetalhes> listar(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "mes", required = false) String mes,
            @RequestParam(value = "tipo", required = false) String tipo,
            @RequestParam(value = "categoriaId", required = false) UUID categoriaId
    ) {
        var pageRequest = PageRequest.of(page, size);
        YearMonth mesFiltro = parseMes(mes);
        TipoLancamento tipoFiltro = parseTipo(tipo);
        return service.listar(pageRequest, mesFiltro, tipoFiltro, categoriaId);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    private YearMonth parseMes(String mes) {
        if (mes == null || mes.isBlank()) {
            return null;
        }

        try {
            return YearMonth.parse(mes);
        } catch (DateTimeParseException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parametro 'mes' invalido. Use o formato yyyy-MM.");
        }
    }

    private TipoLancamento parseTipo(String tipo) {
        if (tipo == null || tipo.isBlank()) {
            return null;
        }

        try {
            return TipoLancamento.valueOf(tipo.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parametro 'tipo' invalido. Valores aceitos: RECEITA, DESPESA.");
        }
    }
}
