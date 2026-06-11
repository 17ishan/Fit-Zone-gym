package com.fitzone.gym.controller.admin;

import com.fitzone.gym.dto.MembershipDtos.AdminMembershipRequest;
import com.fitzone.gym.dto.MembershipDtos.MembershipResponse;
import com.fitzone.gym.dto.PageResponse;
import com.fitzone.gym.entity.MembershipStatus;
import com.fitzone.gym.service.MembershipService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/memberships")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMembershipController {

    private final MembershipService membershipService;

    public AdminMembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping
    public PageResponse<MembershipResponse> list(@RequestParam(required = false) MembershipStatus status,
                                                 @PageableDefault(size = 20) Pageable pageable) {
        return PageResponse.of(membershipService.list(status, pageable), MembershipResponse::from);
    }

    @GetMapping("/{id}")
    public MembershipResponse get(@PathVariable UUID id) {
        return MembershipResponse.from(membershipService.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MembershipResponse create(@Valid @RequestBody AdminMembershipRequest req) {
        return MembershipResponse.from(membershipService.adminCreate(req));
    }

    @PatchMapping("/{id}")
    public MembershipResponse update(@PathVariable UUID id, @RequestBody AdminMembershipRequest req) {
        return MembershipResponse.from(membershipService.adminUpdate(id, req));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        membershipService.delete(id);
    }
}
