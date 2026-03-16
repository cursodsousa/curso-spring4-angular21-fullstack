package io.github.ds.planeja.common.exceptions;

import io.github.ds.planeja.common.validation.CampoInvalido;

import java.util.List;

public class ValidationException extends RuntimeException {

    private final List<CampoInvalido> camposInvalidos;

    public ValidationException(List<CampoInvalido> camposInvalidos){
        super("Erro de validação.");
        this.camposInvalidos = camposInvalidos;
    }

    public List<CampoInvalido> getCamposInvalidos() {
        return camposInvalidos;
    }
}
