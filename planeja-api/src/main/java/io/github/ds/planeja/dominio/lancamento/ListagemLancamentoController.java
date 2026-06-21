package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.dominio.categoria.CategoriaService;
import io.github.ds.planeja.dominio.categoria.dto.CategoriaDetalhes;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoDetalhes;
import io.github.ds.planeja.dominio.lancamento.model.TipoLancamento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("lancamentos")
public class ListagemLancamentoController {

    @Autowired
    private LancamentoService service;

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public Page<LancamentoDetalhes> listar(
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "mes", required = false) String mes,
            @RequestParam(value = "tipo", required = false) String tipo,
            @RequestParam(value = "categoria-id", required = false) UUID categoriaId
    ){
        var pageRequest = PageRequest.of(page, size);
        var mesAno = parseMes(mes);
        var tipoLancamentoSelecionado = parseTipo(tipo);

        return service.listar(pageRequest, mesAno, tipoLancamentoSelecionado, categoriaId);
    }

    @GetMapping("categorias-listagem")
    public List<CategoriaDetalhes> listarTodas(){
        return categoriaService.listarTodas();
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable UUID id){
        service.deletar(id);
    }

    private TipoLancamento parseTipo(String tipo) {
        if(tipo == null || tipo.isBlank()){
            return null;
        }

        try {
            return TipoLancamento.valueOf(tipo);
        } catch (IllegalArgumentException e){
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_CONTENT, "Parametro 'tipo' invalido, valores aceitos: 'RECEITA' ou 'DESPESA'.");
        }
    }

    // yyyy-MM
    private YearMonth parseMes(String mes){
        if(mes == null || mes.isBlank()){
            return null;
        }

        try {
            return YearMonth.parse(mes);
        } catch (DateTimeParseException e){
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_CONTENT, "Parametro 'mes' invalido, use o formato yyyy-MM.");
        }
    }
}
