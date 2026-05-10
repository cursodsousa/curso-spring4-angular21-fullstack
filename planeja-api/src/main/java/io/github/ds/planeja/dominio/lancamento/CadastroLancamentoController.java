package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.dominio.lancamento.dto.LancamentoDetalhes;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoForm;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("lancamentos")
public class CadastroLancamentoController {

    @Autowired
    private LancamentoService service;
//
//    @PostMapping
//    public ResponseEntity<LancamentoDetalhes> criar(
//            @RequestBody @Valid LancamentoForm form){
//        var detalhes = service.criar(form);
//        return ResponseEntity.status(HttpStatus.CREATED).body(detalhes);
//    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LancamentoDetalhes criar(@RequestBody @Valid LancamentoForm form){
        return service.criar(form);
    }
}
