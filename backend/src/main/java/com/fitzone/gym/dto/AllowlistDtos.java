package com.fitzone.gym.dto;

import com.fitzone.gym.entity.AdminAllowlistEntry;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public final class AllowlistDtos {

    private AllowlistDtos() {
    }

    public record AllowlistRequest(@NotBlank @Email String email) {
    }

    public record AllowlistResponse(Long id, String email, String addedBy, Instant createdAt) {

        public static AllowlistResponse from(AdminAllowlistEntry e) {
            return new AllowlistResponse(e.getId(), e.getEmail(), e.getAddedBy(), e.getCreatedAt());
        }
    }
}
