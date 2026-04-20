package io.github.ds.planeja.dominio.categoria;

import io.github.ds.planeja.common.validation.CampoInvalido;
import io.github.ds.planeja.common.validation.ValidationResult;
import io.github.ds.planeja.dominio.categoria.dto.CategoriaForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CategoriaValidator {

    @Autowired
    private CategoriaRepository repository;

    public ValidationResult validar(CategoriaForm form, UUID id) {
        var result = ValidationResult.novo();

        var isListaNaoVazia = !repository.findByDescricaoAndNotId(form.descricao(), id).isEmpty();
        if (isListaNaoVazia) {
            result.add(new CampoInvalido("descricao", "Ja cadastrado."));
        }

        return result;
    }
}
