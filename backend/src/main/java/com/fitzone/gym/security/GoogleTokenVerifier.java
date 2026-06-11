package com.fitzone.gym.security;

import com.fitzone.gym.config.AppProperties;
import com.fitzone.gym.exception.UnauthorizedException;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

/**
 * Verifies a Google ID token (a JWT) by validating its signature against Google's
 * published JWKS, plus issuer / audience / expiry. Uses only Spring Security's Nimbus
 * support — no extra Google client library required.
 */
@Component
public class GoogleTokenVerifier {

    private static final String GOOGLE_JWKS = "https://www.googleapis.com/oauth2/v3/certs";
    private static final Set<String> VALID_ISSUERS =
            Set.of("https://accounts.google.com", "accounts.google.com");

    private final NimbusJwtDecoder decoder;

    public GoogleTokenVerifier(AppProperties props) {
        NimbusJwtDecoder d = NimbusJwtDecoder.withJwkSetUri(GOOGLE_JWKS).build();

        OAuth2TokenValidator<Jwt> issuerValidator = token -> {
            Object iss = token.getIssuer();
            boolean ok = iss != null && VALID_ISSUERS.contains(iss.toString());
            return ok
                    ? OAuth2TokenValidatorResult.success()
                    : OAuth2TokenValidatorResult.failure(
                            new OAuth2Error("invalid_issuer", "Unexpected token issuer", null));
        };

        OAuth2TokenValidator<Jwt> audienceValidator = token -> {
            List<String> aud = token.getAudience();
            return aud != null && aud.contains(props.getGoogle().getClientId())
                    ? OAuth2TokenValidatorResult.success()
                    : OAuth2TokenValidatorResult.failure(
                            new OAuth2Error("invalid_audience", "Token audience does not match client id", null));
        };

        d.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                new JwtTimestampValidator(), issuerValidator, audienceValidator));
        this.decoder = d;
    }

    public GoogleAccount verify(String idToken) {
        final Jwt jwt;
        try {
            jwt = decoder.decode(idToken);
        } catch (JwtException e) {
            throw new UnauthorizedException("Invalid Google token: " + e.getMessage());
        }

        Boolean emailVerified = jwt.getClaim("email_verified");
        String email = jwt.getClaimAsString("email");
        if (email == null || Boolean.FALSE.equals(emailVerified)) {
            throw new UnauthorizedException("Google account email is missing or not verified");
        }
        return new GoogleAccount(
                email.toLowerCase(),
                jwt.getSubject(),
                jwt.getClaimAsString("name"),
                Boolean.TRUE.equals(emailVerified));
    }
}
