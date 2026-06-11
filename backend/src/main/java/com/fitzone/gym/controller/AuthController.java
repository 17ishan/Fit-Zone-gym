package com.fitzone.gym.controller;

import com.fitzone.gym.dto.AuthDtos.AuthResponse;
import com.fitzone.gym.dto.AuthDtos.ForgotPasswordRequest;
import com.fitzone.gym.dto.AuthDtos.GoogleLoginRequest;
import com.fitzone.gym.dto.AuthDtos.LoginRequest;
import com.fitzone.gym.dto.AuthDtos.MessageResponse;
import com.fitzone.gym.dto.AuthDtos.RegisterRequest;
import com.fitzone.gym.dto.AuthDtos.ResetPasswordRequest;
import com.fitzone.gym.dto.UserResponse;
import com.fitzone.gym.security.CurrentUserService;
import com.fitzone.gym.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final MessageResponse RESET_ACK =
            new MessageResponse("If an account exists for that email, a reset link has been sent.");

    private final AuthService authService;
    private final CurrentUserService currentUserService;

    public AuthController(AuthService authService, CurrentUserService currentUserService) {
        this.authService = authService;
        this.currentUserService = currentUserService;
    }

    // ---- Google ----

    @PostMapping("/google")
    public AuthResponse googleLogin(@Valid @RequestBody GoogleLoginRequest req) {
        return authService.googleLogin(req.idToken());
    }

    @PostMapping("/admin/google")
    public AuthResponse adminGoogleLogin(@Valid @RequestBody GoogleLoginRequest req) {
        return authService.adminGoogleLogin(req.idToken());
    }

    // ---- Email / password ----

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/admin/login")
    public AuthResponse adminLogin(@Valid @RequestBody LoginRequest req) {
        return authService.adminLogin(req);
    }

    // ---- Password reset ----

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req.email(), false);
        return RESET_ACK;
    }

    @PostMapping("/admin/forgot-password")
    public MessageResponse adminForgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req.email(), true);
        return RESET_ACK;
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req.token(), req.newPassword());
        return new MessageResponse("Your password has been reset. You can now sign in.");
    }

    @GetMapping("/me")
    public UserResponse me() {
        return UserResponse.from(currentUserService.requireCurrentUser());
    }
}
