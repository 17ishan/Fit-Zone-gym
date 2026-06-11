package com.fitzone.gym.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class JwtConfig {

    public static final String HMAC_ALG = "HmacSHA256";

    private SecretKey secretKey(AppProperties props) {
        String secret = props.getJwt().getSecret();
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                    "app.jwt.secret must be set and at least 32 bytes (256-bit) for HS256");
        }
        return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_ALG);
    }

    /** Encoder for issuing our own access tokens (HS256). */
    @Bean
    public JwtEncoder jwtEncoder(AppProperties props) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(secretKey(props)));
    }

    /**
     * Decoder for validating OUR tokens. Marked primary so the OAuth2 resource server
     * picks it up (the Google ID-token decoder lives privately inside GoogleTokenVerifier).
     */
    @Bean
    @Primary
    public JwtDecoder jwtDecoder(AppProperties props) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withSecretKey(secretKey(props))
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(props.getJwt().getIssuer()));
        return decoder;
    }
}
