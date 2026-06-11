package com.fitzone.gym.service;

import com.fitzone.gym.dto.MembershipDtos.AdminMembershipRequest;
import com.fitzone.gym.dto.MembershipDtos.PurchaseRequest;
import com.fitzone.gym.entity.*;
import com.fitzone.gym.exception.NotFoundException;
import com.fitzone.gym.repository.MembershipRepository;
import com.fitzone.gym.repository.PaymentRepository;
import com.fitzone.gym.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class MembershipService {

    private final MembershipRepository membershipRepo;
    private final PaymentRepository paymentRepo;
    private final UserRepository userRepo;
    private final PlanService planService;

    public MembershipService(MembershipRepository membershipRepo, PaymentRepository paymentRepo,
                             UserRepository userRepo, PlanService planService) {
        this.membershipRepo = membershipRepo;
        this.paymentRepo = paymentRepo;
        this.userRepo = userRepo;
        this.planService = planService;
    }

    /**
     * Atomic purchase: optionally update the buyer's profile, create the membership,
     * and record the (demo) payment in a single transaction. Replaces the previous
     * three non-transactional Supabase inserts.
     */
    @Transactional
    public Membership purchase(User user, PurchaseRequest req) {
        Plan plan = planService.get(req.planId());

        // Fill in profile details captured at checkout, if provided.
        boolean dirty = false;
        if (req.name() != null && !req.name().isBlank()) { user.setName(req.name()); dirty = true; }
        if (req.phone() != null) { user.setPhone(req.phone()); dirty = true; }
        if (req.address() != null) { user.setAddress(req.address()); dirty = true; }
        if (req.age() != null) { user.setAge(req.age()); dirty = true; }
        if (dirty) {
            userRepo.save(user);
        }

        LocalDate start = LocalDate.now();
        LocalDate end = start.plusMonths(plan.getDurationMonths());

        Membership m = new Membership();
        m.setUser(user);
        m.setPlan(plan);
        m.setPlanName(plan.getName());
        m.setPriceMinor(plan.getPriceMinor());
        m.setStartDate(start);
        m.setEndDate(end);
        m.setStatus(MembershipStatus.ACTIVE);
        m = membershipRepo.save(m);

        Payment payment = new Payment();
        payment.setMembership(m);
        payment.setUser(user);
        payment.setAmountMinor(plan.getPriceMinor());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setMethod(req.paymentMethod() != null ? req.paymentMethod() : "demo");
        payment.setProviderPaymentId("demo_" + System.currentTimeMillis());
        paymentRepo.save(payment);

        return m;
    }

    public List<Membership> byUser(UUID userId) {
        return membershipRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ---- Admin ----

    public Page<Membership> list(MembershipStatus status, Pageable pageable) {
        return status != null
                ? membershipRepo.findByStatus(status, pageable)
                : membershipRepo.findAll(pageable);
    }

    public Membership get(UUID id) {
        return membershipRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Membership not found: " + id));
    }

    @Transactional
    public Membership adminCreate(AdminMembershipRequest req) {
        User user = userRepo.findById(req.userId())
                .orElseThrow(() -> new NotFoundException("User not found: " + req.userId()));
        Membership m = new Membership();
        m.setUser(user);
        applyAdmin(m, req);
        return membershipRepo.save(m);
    }

    @Transactional
    public Membership adminUpdate(UUID id, AdminMembershipRequest req) {
        Membership m = get(id);
        if (req.userId() != null && !req.userId().equals(m.getUser().getId())) {
            User user = userRepo.findById(req.userId())
                    .orElseThrow(() -> new NotFoundException("User not found: " + req.userId()));
            m.setUser(user);
        }
        applyAdmin(m, req);
        return membershipRepo.save(m);
    }

    private void applyAdmin(Membership m, AdminMembershipRequest req) {
        if (req.planId() != null) {
            Plan plan = planService.get(req.planId());
            m.setPlan(plan);
            if (req.planName() == null) m.setPlanName(plan.getName());
            if (req.priceMinor() == null) m.setPriceMinor(plan.getPriceMinor());
        }
        if (req.planName() != null) m.setPlanName(req.planName());
        if (req.priceMinor() != null) m.setPriceMinor(req.priceMinor());
        if (req.startDate() != null) m.setStartDate(req.startDate());
        if (req.endDate() != null) m.setEndDate(req.endDate());
        if (req.status() != null) m.setStatus(req.status());
        // Sensible defaults for required fields on create.
        if (m.getStartDate() == null) m.setStartDate(LocalDate.now());
        if (m.getEndDate() == null) m.setEndDate(LocalDate.now().plusMonths(1));
        if (m.getPlanName() == null) m.setPlanName("Custom");
        if (m.getPriceMinor() == null) m.setPriceMinor(0L);
        if (m.getStatus() == null) m.setStatus(MembershipStatus.ACTIVE);
    }

    @Transactional
    public void delete(UUID id) {
        if (!membershipRepo.existsById(id)) {
            throw new NotFoundException("Membership not found: " + id);
        }
        membershipRepo.deleteById(id);
    }
}
