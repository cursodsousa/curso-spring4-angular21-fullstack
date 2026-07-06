package io.github.ds.planeja.infra.security;

import io.github.ds.planeja.dominio.usuario.model.UsuarioEntity;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtService jwtService;

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        if("OPTIONS".equalsIgnoreCase(request.getMethod())){
            return true;
        }

        // Bearer token
        String authorization = request.getHeader("Authorization");
        if(authorization == null || !authorization.startsWith("Bearer ")){
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return false;
        }

        String token = authorization.substring(7);
        if(!jwtService.isTokenValido(token)){
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return false;
        }

        UsuarioEntity usuario = jwtService.getUsuario(token);
        request.setAttribute("usuarioAutenticado", usuario);
        return true;
    }
}
