package com.fitzone.gym.service;

import com.fitzone.gym.config.AppProperties;
import com.fitzone.gym.dto.AuthDtos.AuthResponse;
import com.fitzone.gym.dto.AuthDtos.LoginRequest;
import com.fitzone.gym.dto.AuthDtos.RegisterRequest;
import com.fitzone.gym.dto.UserResponse;
import com.fitzone.gym.entity.PasswordResetToken;
import com.fitzone.gym.entity.User;
import com.fitzone.gym.exception.BadRequestException;
import com.fitzone.gym.exception.ForbiddenException;
import com.fitzone.gym.exception.UnauthorizedException;
import com.fitzone.gym.repository.PasswordResetTokenRepository;
import com.fitzone.gym.security.GoogleAccount;
import com.fitzone.gym.security.GoogleTokenVerifier;
import com.fitzone.gym.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class AuthService {

    private static final long RESET_TOKEN_TTL_MINUTES = 30;

    private final GoogleTokenVerifier verifier;
    private final JwtService jwtService;
    private final UserService userService;
    private final AllowlistService allowlistService;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository resetTokenRepo;
    private final MailService mailService;
    private final AppProperties props;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(GoogleTokenVerifier verifier, JwtService jwtService,
                       UserService userService, AllowlistService allowlistService,
                       PasswordEncoder passwordEncoder, PasswordResetTokenRepository resetTokenRepo,
                       MailService mailService, AppProperties props) {
        this.verifier = verifier;
        this.jwtService = jwtService;
        this.userService = userService;
        this.allowlistService = allowlistService;
        this.passwordEncoder = passwordEncoder;
        this.resetTokenRepo = resetTokenRepo;
        this.mailService = mailService;
        this.props = props;
    }

    // ---- Google ----

    /** User-site Google login. Anyone with a valid Google account gets a USER token. */
    public AuthResponse googleLogin(String idToken) {
        GoogleAccount account = verifier.verify(idToken);
        User user = userService.findOrCreate(account);
        return tokenResponse(user);
    }

    /** Admin-portal Google login. Only allowlisted emails are granted an ADMIN token. */
    public AuthResponse adminGoogleLogin(String idToken) {
        GoogleAccount account = verifier.verify(idToken);
        if (!allowlistService.isAllowed(account.email())) {
            throw new ForbiddenException("This Google account is not authorized for admin access");
        }
        User user = userService.findOrCreate(account);
        user = userService.ensureAdmin(user);
        return tokenResponse(user);
    }

    // ---- Email / password ----

    /** Public self-registration. Always creates a USER account; the email doubles as the username. */
    public AuthResponse register(RegisterRequest req) {
        if (userService.emailExists(req.email())) {
            throw new BadRequestException("An account with this email already exists");
        }
        User user = userService.registerLocal(req.name(), req.email(), passwordEncoder.encode(req.password()));
        return tokenResponse(user);
    }

    /** User-site password login. Any role may sign in here. */
    public AuthResponse login(LoginRequest req) {
        User user = authenticate(req);
        return tokenResponse(user);
    }

    /** Admin-portal password login. Requires an allowlisted, ADMIN account. */
    public AuthResponse adminLogin(LoginRequest req) {
        User user = authenticate(req);
        if (!allowlistService.isAllowed(user.getEmail())) {
            throw new ForbiddenException("This account is not authorized for admin access");
        }
        user = userService.ensureAdmin(user);
        return tokenResponse(user);
    }

    private User authenticate(LoginRequest req) {
        User user = userService.findByIdentifier(req.identifier().trim())
                .filter(u -> u.getPasswordHash() != null)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        return user;
    }

    // ---- Password reset ----

    /**
     * Issue a reset token and email a link. The response is intentionally generic — we never reveal
     * whether the email is registered. {@code admin} controls which frontend the link points to.
     */
    @Transactional
    public void forgotPassword(String email, boolean admin) {
        Optional<User> maybeUser = userService.findByEmail(email);
        if (maybeUser.isEmpty()) {
            return; // silently succeed to avoid account enumeration
        }
        User user = maybeUser.get();
        if (admin && !allowlistService.isAllowed(user.getEmail())) {
            return; // don't hand out admin-portal reset links to non-admins
        }

        String rawToken = generateRawToken();
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setTokenHash(sha256(rawToken));
        token.setExpiresAt(Instant.now().plus(RESET_TOKEN_TTL_MINUTES, ChronoUnit.MINUTES));
        resetTokenRepo.save(token);

        String base = admin ? props.getFrontend().getAdminUrl() : props.getFrontend().getUserUrl();
        String link = base.replaceAll("/+$", "") + "/reset-password?token=" + rawToken;
        mailService.sendPasswordReset(user.getEmail(), link);
    }

    /** Consume a reset token and set the new password. */
    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        PasswordResetToken token = resetTokenRepo.findByTokenHash(sha256(rawToken))
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset link"));
        if (token.isUsed() || token.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("Invalid or expired reset link");
        }
        User user = token.getUser();
        userService.setPasswordHash(user, passwordEncoder.encode(newPassword));
        token.setUsed(true);
        resetTokenRepo.save(token);
    }

    // ---- helpers ----

    private AuthResponse tokenResponse(User user) {
        return new AuthResponse(jwtService.issueAccessToken(user), UserResponse.from(user));
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String sha256(String value) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
