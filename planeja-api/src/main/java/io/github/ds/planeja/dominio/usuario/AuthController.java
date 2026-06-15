package io.github.ds.planeja.dominio.usuario;

import io.github.ds.planeja.dominio.usuario.dto.AuthResponse;
import io.github.ds.planeja.dominio.usuario.dto.LoginForm;
import io.github.ds.planeja.dominio.usuario.dto.UsuarioCadastroForm;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse cadastrar(@RequestBody @Valid UsuarioCadastroForm form) {
        return service.cadastrar(form);
    }

    @PostMapping("login")
    public AuthResponse login(@RequestBody @Valid LoginForm form) {
        return service.autenticar(form);
    }
}
