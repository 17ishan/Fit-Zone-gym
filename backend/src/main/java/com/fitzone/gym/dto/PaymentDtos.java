package com.fitzone.gym.dto;

import com.fitzone.gym.entity.Payment;
import com.fitzone.gym.entity.PaymentStatus;

import java.time.Instant;
import java.util.UUID;

public final class PaymentDtos {

    private PaymentDtos() {
    }

    public record PaymentResponse(
            UUID id,
            UUID membershipId,
            UUID userId,
            String userName,
            Long amountMinor,
            PaymentStatus status,
            String method,
            String providerPaymentId,
            Instant createdAt) {

        public static PaymentResponse from(Payment p) {
            return new PaymentResponse(
                    p.getId(),
                    p.getMembership().getId(),
                    p.getUser().getId(),
                    p.getUser().getName(),
                    p.getAmountMinor(),
                    p.getStatus(),
                    p.getMethod(),
                    p.getProviderPaymentId(),
                    p.getCreatedAt());
        }
    }

    public record PaymentUpdateRequest(PaymentStatus status, String method) {
    }
}
