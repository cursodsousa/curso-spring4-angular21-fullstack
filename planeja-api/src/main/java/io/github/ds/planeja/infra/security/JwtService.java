package io.github.ds.planeja.infra.security;

import io.github.ds.planeja.dominio.usuario.model.UsuarioEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

@Service
public class JwtService {

    private static final String ALGORITMO = "HmacSHA256";

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-seconds}")
    private long expirationSeconds;

    public long getExpirationSeconds() {
        return expirationSeconds;
    }

    public String gerarToken(UsuarioEntity usuario){
        long expiration = Instant.now().plusSeconds(expirationSeconds).getEpochSecond();
        String header = base64Url("""
                { "alg": "HS256", "typ": "JWT" }
                """);

        String payload = base64Url("""
                { "sub": "%s", "nome": "%s", "exp": %d }
                """.formatted(usuario.getId().toString(), usuario.getNome(), expiration));


        String signature = assinar(header + "." + payload);

        return header + "." + payload + "." + signature;
    }

    private String assinar(String conteudo){
        try{
            Mac mac = Mac.getInstance(ALGORITMO);
            byte[] bytesSecret = secret.getBytes(StandardCharsets.UTF_8);
            SecretKeySpec chavePrivada = new SecretKeySpec(bytesSecret, ALGORITMO);
            mac.init(chavePrivada);
            byte[] chavePublica = mac.doFinal(conteudo.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(chavePublica);
        } catch (Exception e){
            throw new IllegalStateException("Erro ao gerar JWT.", e);
        }
    }

    private String base64Url(String valor){
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(valor.getBytes(StandardCharsets.UTF_8));
    }

}
