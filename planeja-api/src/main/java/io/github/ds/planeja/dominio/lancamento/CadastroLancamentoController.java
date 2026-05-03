package io.github.ds.planeja.dominio.lancamento;

import io.github.ds.planeja.dominio.cartao.CartaoService;
import io.github.ds.planeja.dominio.cartao.dto.CartaoDetalhes;
import io.github.ds.planeja.dominio.categoria.CategoriaService;
import io.github.ds.planeja.dominio.categoria.dto.CategoriaDetalhes;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoDetalhes;
import io.github.ds.planeja.dominio.lancamento.dto.LancamentoForm;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("lancamentos")
@CrossOrigin("*")
public class CadastroLancamentoController {

    @Autowired
    private LancamentoService service;
    @Autowired
    private CategoriaService categoriaService;
    @Autowired
    private CartaoService cartaoService;

    @PostMapping
    public ResponseEntity<LancamentoDetalhes> criar(@RequestBody @Valid LancamentoForm novo) {
        var detalhes = service.criar(novo);
        return ResponseEntity.status(HttpStatus.CREATED).body(detalhes);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("categorias-disponiveis")
    public List<CategoriaDetalhes> listarCategoriasDisponiveis() {
        return categoriaService.listarAtivas();
    }

    @GetMapping("cartoes-disponiveis")
    public List<CartaoDetalhes> listarCartoesDisponiveis() {
        return cartaoService.listarAtivos();
    }

}
