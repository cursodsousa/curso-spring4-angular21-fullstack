package io.github.ds.planeja.common.validation;

import java.util.ArrayList;
import java.util.List;

public class ValidationResult {

    private List<CampoInvalido> campoInvalidos;

    private ValidationResult(List<CampoInvalido> campoInvalidos) {
        this.campoInvalidos = campoInvalidos;
    }

    public static ValidationResult novo(){
        return new ValidationResult(new ArrayList<>());
    }

    public void add(CampoInvalido campoInvalido){
        this.campoInvalidos.add(campoInvalido);
    }

    public List<CampoInvalido> getCampoInvalidos() {
        return campoInvalidos;
    }

    public boolean isInvalido(){
        return !campoInvalidos.isEmpty();
    }
}
