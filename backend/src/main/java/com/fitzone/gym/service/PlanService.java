package com.fitzone.gym.service;

import com.fitzone.gym.dto.PlanDtos.PlanRequest;
import com.fitzone.gym.entity.Plan;
import com.fitzone.gym.exception.NotFoundException;
import com.fitzone.gym.repository.PlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlanService {

    private final PlanRepository repo;

    public PlanService(PlanRepository repo) {
        this.repo = repo;
    }

    public List<Plan> activePlans() {
        return repo.findByActiveTrueOrderBySortOrderAsc();
    }

    public List<Plan> allPlans() {
        return repo.findAllByOrderBySortOrderAsc();
    }

    public Plan get(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Plan not found: " + id));
    }

    @Transactional
    public Plan create(PlanRequest req) {
        Plan p = new Plan();
        apply(p, req);
        return repo.save(p);
    }

    @Transactional
    public Plan update(Long id, PlanRequest req) {
        Plan p = get(id);
        apply(p, req);
        return repo.save(p);
    }

    /** Soft delete: deactivate so historical memberships keep their plan reference. */
    @Transactional
    public Plan deactivate(Long id) {
        Plan p = get(id);
        p.setActive(false);
        return repo.save(p);
    }

    private void apply(Plan p, PlanRequest req) {
        p.setName(req.name());
        p.setPriceMinor(req.priceMinor());
        p.setDurationMonths(req.durationMonths());
        p.setFeatures(req.features() != null ? new ArrayList<>(req.features()) : new ArrayList<>());
        if (req.popular() != null) p.setPopular(req.popular());
        if (req.active() != null) p.setActive(req.active());
        if (req.sortOrder() != null) p.setSortOrder(req.sortOrder());
    }
}
