package com.fitzone.gym.dto;

import java.util.List;

public final class DashboardDtos {

    private DashboardDtos() {
    }

    public record PlanCount(String planName, long count) {
    }

    public record RevenuePoint(String month, long totalMinor) {
    }

    public record DashboardStatsResponse(
            long totalUsers,
            long activeMemberships,
            long totalRevenueMinor,
            long paymentsThisMonth,
            long newContacts,
            List<PlanCount> membershipsByPlan,
            List<RevenuePoint> revenueByMonth) {
    }
}
