package io.github.ds.planeja.dominio.usuario;

import io.github.ds.planeja.common.exceptions.UnauthorizedException;
import io.github.ds.planeja.common.exceptions.ValidationException;
import io.github.ds.planeja.common.validation.CampoInvalido;
import io.github.ds.planeja.dominio.usuario.dto.AuthResponse;
import io.github.ds.planeja.dominio.usuario.dto.LoginForm;
import io.github.ds.planeja.dominio.usuario.dto.UsuarioCadastroForm;
import io.github.ds.planeja.dominio.usuario.model.UsuarioEntity;
import io.github.ds.planeja.infra.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    public AuthResponse cadastrar(UsuarioCadastroForm form) {
        if (usuarioRepository.existsByLogin(form.login())) {
            throw new ValidationException(List.of(new CampoInvalido("login", "Login já cadastrado.")));
        }

        UsuarioEntity usuario = new UsuarioEntity();
        usuario.setNome(form.nome());
        usuario.setLogin(form.login());
        usuario.setSenha(passwordEncoder.encode(form.senha()));

        usuarioRepository.save(usuario);

        return gerarResposta(usuario);
    }

    public AuthResponse autenticar(LoginForm form) {
        UsuarioEntity usuario = usuarioRepository.findByLogin(form.login())
                .orElseThrow(() -> new UnauthorizedException("Login ou senha inválidos."));

        if (!passwordEncoder.matches(form.senha(), usuario.getSenha())) {
            throw new UnauthorizedException("Login ou senha inválidos.");
        }

        return gerarResposta(usuario);
    }

    private AuthResponse gerarResposta(UsuarioEntity usuario) {
        return new AuthResponse(
                jwtService.gerarToken(usuario),
                "Bearer",
                jwtService.getExpirationSeconds(),
                usuario.getNome()
        );
    }
}
