package com.fitzone.gym.dto;

import com.fitzone.gym.entity.Plan;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public final class PlanDtos {

    private PlanDtos() {
    }

    public record PlanResponse(
            Long id,
            String name,
            Long priceMinor,
            Integer durationMonths,
            List<String> features,
            boolean popular,
            boolean active,
            Integer sortOrder) {

        public static PlanResponse from(Plan p) {
            return new PlanResponse(p.getId(), p.getName(), p.getPriceMinor(),
                    p.getDurationMonths(), p.getFeatures(), p.isPopular(), p.isActive(), p.getSortOrder());
        }
    }

    public record PlanRequest(
            @NotBlank String name,
            @NotNull @Min(0) Long priceMinor,
            @NotNull @Min(1) Integer durationMonths,
            List<String> features,
            Boolean popular,
            Boolean active,
            Integer sortOrder) {
    }
}
