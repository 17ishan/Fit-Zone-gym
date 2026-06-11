package com.fitzone.gym.controller.admin;

import com.fitzone.gym.dto.AllowlistDtos.AllowlistRequest;
import com.fitzone.gym.dto.AllowlistDtos.AllowlistResponse;
import com.fitzone.gym.security.CurrentUserService;
import com.fitzone.gym.service.AllowlistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/allowlist")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAllowlistController {

    private final AllowlistService allowlistService;
    private final CurrentUserService currentUser;

    public AdminAllowlistController(AllowlistService allowlistService, CurrentUserService currentUser) {
        this.allowlistService = allowlistService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<AllowlistResponse> list() {
        return allowlistService.list().stream().map(AllowlistResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AllowlistResponse add(@Valid @RequestBody AllowlistRequest req) {
        String addedBy = currentUser.requireCurrentUser().getEmail();
        return AllowlistResponse.from(allowlistService.add(req.email(), addedBy));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        allowlistService.delete(id);
    }
}
