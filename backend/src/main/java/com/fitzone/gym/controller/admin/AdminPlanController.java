package com.fitzone.gym.controller.admin;

import com.fitzone.gym.dto.PlanDtos.PlanRequest;
import com.fitzone.gym.dto.PlanDtos.PlanResponse;
import com.fitzone.gym.service.PlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/plans")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPlanController {

    private final PlanService planService;

    public AdminPlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    public List<PlanResponse> list() {
        return planService.allPlans().stream().map(PlanResponse::from).toList();
    }

    @GetMapping("/{id}")
    public PlanResponse get(@PathVariable Long id) {
        return PlanResponse.from(planService.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlanResponse create(@Valid @RequestBody PlanRequest req) {
        return PlanResponse.from(planService.create(req));
    }

    @PatchMapping("/{id}")
    public PlanResponse update(@PathVariable Long id, @Valid @RequestBody PlanRequest req) {
        return PlanResponse.from(planService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public PlanResponse deactivate(@PathVariable Long id) {
        return PlanResponse.from(planService.deactivate(id));
    }
}
