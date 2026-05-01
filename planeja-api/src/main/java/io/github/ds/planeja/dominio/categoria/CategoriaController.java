package io.github.ds.planeja.dominio.categoria;

import io.github.ds.planeja.dominio.categoria.dto.CategoriaDetalhes;
import io.github.ds.planeja.dominio.categoria.dto.CategoriaForm;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("categorias")
@CrossOrigin("*")
public class CategoriaController {

    @Autowired
    private CategoriaService service;

    @PostMapping
    public ResponseEntity<CategoriaDetalhes> criar(
            @RequestBody @Valid CategoriaForm nova){
        CategoriaDetalhes detalhes = service.criar(nova);
        return ResponseEntity.status(HttpStatus.CREATED).body(detalhes);
    }

    @GetMapping
    public Page<CategoriaDetalhes> listar(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ){
        var pageRequest = PageRequest.of(page, size);
        return service.listar(pageRequest);
    }

    @PatchMapping("{id}/status")
    public ResponseEntity<Void> mudarStatus(@PathVariable UUID id){
        service.mudarStatus(id);
        return ResponseEntity.noContent().build();
    }
}
