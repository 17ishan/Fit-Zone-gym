package com.fitzone.gym.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Authentication-related request/response payloads. */
public final class AuthDtos {

    private AuthDtos() {
    }

    public record GoogleLoginRequest(@NotBlank String idToken) {
    }

    public record RegisterRequest(
            @NotBlank @Size(max = 255) String name,
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank @Size(min = 8, max = 100) String password) {
    }

    /** {@code identifier} is the user's email or username. */
    public record LoginRequest(
            @NotBlank String identifier,
            @NotBlank String password) {
    }

    public record ForgotPasswordRequest(@NotBlank @Email String email) {
    }

    public record ResetPasswordRequest(
            @NotBlank String token,
            @NotBlank @Size(min = 8, max = 100) String newPassword) {
    }

    /** Generic acknowledgement for endpoints that must not leak whether an email exists. */
    public record MessageResponse(String message) {
    }

    public record AuthResponse(String accessToken, UserResponse user) {
    }
}
