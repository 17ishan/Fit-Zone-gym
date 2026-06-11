package com.fitzone.gym.dto;

import com.fitzone.gym.entity.ContactStatus;
import com.fitzone.gym.entity.ContactSubmission;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.UUID;

public final class ContactDtos {

    private ContactDtos() {
    }

    public record ContactRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank String message) {
    }

    public record ContactResponse(
            UUID id,
            String name,
            String email,
            String message,
            ContactStatus status,
            Instant createdAt) {

        public static ContactResponse from(ContactSubmission c) {
            return new ContactResponse(c.getId(), c.getName(), c.getEmail(),
                    c.getMessage(), c.getStatus(), c.getCreatedAt());
        }
    }

    public record ContactUpdateRequest(ContactStatus status) {
    }
}
