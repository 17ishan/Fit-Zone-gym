package com.fitzone.gym.service;

import com.fitzone.gym.dto.DashboardDtos.DashboardStatsResponse;
import com.fitzone.gym.dto.DashboardDtos.PlanCount;
import com.fitzone.gym.dto.DashboardDtos.RevenuePoint;
import com.fitzone.gym.entity.ContactStatus;
import com.fitzone.gym.entity.MembershipStatus;
import com.fitzone.gym.repository.ContactSubmissionRepository;
import com.fitzone.gym.repository.MembershipRepository;
import com.fitzone.gym.repository.PaymentRepository;
import com.fitzone.gym.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class DashboardService {

    private final UserRepository userRepo;
    private final MembershipRepository membershipRepo;
    private final PaymentRepository paymentRepo;
    private final ContactSubmissionRepository contactRepo;

    public DashboardService(UserRepository userRepo, MembershipRepository membershipRepo,
                            PaymentRepository paymentRepo, ContactSubmissionRepository contactRepo) {
        this.userRepo = userRepo;
        this.membershipRepo = membershipRepo;
        this.paymentRepo = paymentRepo;
        this.contactRepo = contactRepo;
    }

    public DashboardStatsResponse stats() {
        long totalUsers = userRepo.count();
        long activeMemberships = membershipRepo.countByStatus(MembershipStatus.ACTIVE);
        long totalRevenue = paymentRepo.sumSuccessfulAmountMinor();

        var startOfMonth = LocalDate.now(ZoneOffset.UTC)
                .withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        long paymentsThisMonth = paymentRepo.countByCreatedAtAfter(startOfMonth);
        long newContacts = contactRepo.countByStatus(ContactStatus.NEW);

        List<PlanCount> byPlan = membershipRepo.countGroupByPlanName().stream()
                .map(p -> new PlanCount(p.getPlanName(), p.getCount()))
                .toList();

        List<RevenuePoint> revenue = paymentRepo.revenueByMonth().stream()
                .map(r -> new RevenuePoint(r.getMonth(), r.getTotal()))
                .toList();

        return new DashboardStatsResponse(
                totalUsers, activeMemberships, totalRevenue,
                paymentsThisMonth, newContacts, byPlan, revenue);
    }
}
