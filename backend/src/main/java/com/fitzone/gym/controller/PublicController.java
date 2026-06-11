package com.fitzone.gym.controller;

import com.fitzone.gym.dto.ContactDtos.ContactRequest;
import com.fitzone.gym.dto.ContactDtos.ContactResponse;
import com.fitzone.gym.dto.PlanDtos.PlanResponse;
import com.fitzone.gym.service.ContactService;
import com.fitzone.gym.service.PlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final PlanService planService;
    private final ContactService contactService;

    public PublicController(PlanService planService, ContactService contactService) {
        this.planService = planService;
        this.contactService = contactService;
    }

    @GetMapping("/plans")
    public List<PlanResponse> plans() {
        return planService.activePlans().stream().map(PlanResponse::from).toList();
    }

    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse contact(@Valid @RequestBody ContactRequest req) {
        return ContactResponse.from(contactService.submit(req));
    }
}
