package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.dominio.cartao.CartaoService;
import io.github.ds.planeja.dominio.cartao.dto.CartaoDetalhes;
import io.github.ds.planeja.dominio.categoria.CategoriaService;
import io.github.ds.planeja.dominio.categoria.dto.CategoriaDetalhes;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoDetalhes;
import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("lancamentos")
@CrossOrigin("*")
public class ListagemLancamentoController {

    @Autowired
    private LancamentoService lancamentoService;

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
        return lancamentoService.listar(pageRequest, mesFiltro, tipoFiltro, categoriaId);
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
