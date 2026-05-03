package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.dominio.lancamento.dto.LancamentoDetalhes;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoForm;
import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
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
            @DateTimeFormat(pattern = "yyyy-MM")
            @RequestParam(value = "mes", required = false) YearMonth mes,
            @RequestParam(value = "tipo", required = false) TipoLancamento tipo,
            @RequestParam(value = "categoriaId", required = false) UUID categoriaId
    ) {
        var pageRequest = PageRequest.of(page, size);
        return service.listar(pageRequest, mes, tipo, categoriaId);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
