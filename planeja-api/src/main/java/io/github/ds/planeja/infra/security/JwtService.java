package io.github.ds.planeja.infra.security;

import io.github.ds.planeja.dominio.usuario.model.UsuarioEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class JwtService {

    private static final String ALGORITHM = "HmacSHA256";
    private static final Pattern EXP_PATTERN = Pattern.compile("\"exp\":(\\d+)");
    private static final Pattern SUB_PATTERN = Pattern.compile("\"sub\":\"([^\"]+)\"");

    @Value("${planeja.jwt.secret:planeja-api-dev-secret-change-me}")
    private String secret;

    @Value("${planeja.jwt.expiration-seconds:3600}")
    private long expirationSeconds;

    public String gerarToken(UsuarioEntity usuario) {
        long expiraEm = Instant.now().plusSeconds(expirationSeconds).getEpochSecond();

        String header = base64Url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        String payload = base64Url("""
                {"sub":"%s","nome":"%s","exp":%d}
                """.formatted(escape(usuario.getLogin()), escape(usuario.getNome()), expiraEm).trim());
        String assinatura = assinar(header + "." + payload);

        return header + "." + payload + "." + assinatura;
    }

    public long getExpirationSeconds() {
        return expirationSeconds;
    }

    public boolean isTokenValido(String token) {
        try {
            String[] partes = token.split("\\.");
            if (partes.length != 3) {
                return false;
            }

            String assinaturaEsperada = assinar(partes[0] + "." + partes[1]);
            if (!assinaturaEsperada.equals(partes[2])) {
                return false;
            }

            String payload = new String(Base64.getUrlDecoder().decode(partes[1]), StandardCharsets.UTF_8);
            Matcher matcher = EXP_PATTERN.matcher(payload);
            if (!matcher.find()) {
                return false;
            }

            long expiraEm = Long.parseLong(matcher.group(1));
            return Instant.now().getEpochSecond() < expiraEm;
        } catch (RuntimeException e) {
            return false;
        }
    }

    public String getLogin(String token) {
        String[] partes = token.split("\\.");
        String payload = new String(Base64.getUrlDecoder().decode(partes[1]), StandardCharsets.UTF_8);
        Matcher matcher = SUB_PATTERN.matcher(payload);

        return matcher.find() ? matcher.group(1) : null;
    }

    private String assinar(String conteudo) {
        try {
            Mac mac = Mac.getInstance(ALGORITHM);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), ALGORITHM));
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(mac.doFinal(conteudo.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("Erro ao gerar token JWT.", e);
        }
    }

    private String base64Url(String valor) {
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString(valor.getBytes(StandardCharsets.UTF_8));
    }

    private String escape(String valor) {
        return valor.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
