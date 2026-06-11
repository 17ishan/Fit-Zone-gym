package com.fitzone.gym.dto;

import com.fitzone.gym.entity.Membership;
import com.fitzone.gym.entity.MembershipStatus;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public final class MembershipDtos {

    private MembershipDtos() {
    }

    /** User-initiated purchase. Identity (name/email) comes from the auth token. */
    public record PurchaseRequest(
            @NotNull Long planId,
            String name,
            String phone,
            String address,
            Integer age,
            String paymentMethod) {
    }

    /** Admin create/update of a membership. */
    public record AdminMembershipRequest(
            @NotNull UUID userId,
            Long planId,
            String planName,
            Long priceMinor,
            LocalDate startDate,
            LocalDate endDate,
            MembershipStatus status) {
    }

    public record MembershipResponse(
            UUID id,
            UUID userId,
            String userName,
            String userEmail,
            Long planId,
            String planName,
            Long priceMinor,
            LocalDate startDate,
            LocalDate endDate,
            MembershipStatus status,
            Instant createdAt) {

        public static MembershipResponse from(Membership m) {
            return new MembershipResponse(
                    m.getId(),
                    m.getUser().getId(),
                    m.getUser().getName(),
                    m.getUser().getEmail(),
                    m.getPlan() != null ? m.getPlan().getId() : null,
                    m.getPlanName(),
                    m.getPriceMinor(),
                    m.getStartDate(),
                    m.getEndDate(),
                    m.getStatus(),
                    m.getCreatedAt());
        }
    }
}
