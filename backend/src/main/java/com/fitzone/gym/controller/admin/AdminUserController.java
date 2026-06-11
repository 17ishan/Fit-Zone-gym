package com.fitzone.gym.controller.admin;

import com.fitzone.gym.dto.PageResponse;
import com.fitzone.gym.dto.UserResponse;
import com.fitzone.gym.dto.UserUpdateRequest;
import com.fitzone.gym.entity.Role;
import com.fitzone.gym.service.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public PageResponse<UserResponse> list(@RequestParam(required = false) String q,
                                           @PageableDefault(size = 20) Pageable pageable) {
        return PageResponse.of(userService.list(q, pageable), UserResponse::from);
    }

    @GetMapping("/{id}")
    public UserResponse get(@PathVariable UUID id) {
        return UserResponse.from(userService.get(id));
    }

    @PatchMapping("/{id}")
    public UserResponse update(@PathVariable UUID id, @RequestBody UserUpdateRequest req) {
        return UserResponse.from(userService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        userService.delete(id);
    }

    @PostMapping("/{id}/promote")
    public UserResponse promote(@PathVariable UUID id) {
        return UserResponse.from(userService.setRole(id, Role.ADMIN));
    }

    @PostMapping("/{id}/demote")
    public UserResponse demote(@PathVariable UUID id) {
        return UserResponse.from(userService.setRole(id, Role.USER));
    }
}
