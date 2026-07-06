package io.github.ds.planeja.dominio.usuario;

import io.github.ds.planeja.dominio.usuario.dto.AuthResponse;
import io.github.ds.planeja.dominio.usuario.dto.LoginForm;
import io.github.ds.planeja.dominio.usuario.dto.UsuarioCadastroForm;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/signup")
    public AuthResponse cadastrar(@RequestBody @Valid UsuarioCadastroForm form){
        return service.cadastrar(form);
    }

    @PostMapping("/signin")
    public AuthResponse autenticar(@RequestBody @Valid LoginForm form){
        return service.autenticar(form);
    }
}
