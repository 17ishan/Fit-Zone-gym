package com.fitzone.gym.controller;

import com.fitzone.gym.dto.MembershipDtos.MembershipResponse;
import com.fitzone.gym.dto.MembershipDtos.PurchaseRequest;
import com.fitzone.gym.dto.PaymentDtos.PaymentResponse;
import com.fitzone.gym.dto.UserResponse;
import com.fitzone.gym.dto.UserUpdateRequest;
import com.fitzone.gym.entity.User;
import com.fitzone.gym.security.CurrentUserService;
import com.fitzone.gym.service.MembershipService;
import com.fitzone.gym.service.PaymentService;
import com.fitzone.gym.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Endpoints for authenticated end users (role USER or ADMIN). */
@RestController
@RequestMapping("/api")
public class UserAreaController {

    private final CurrentUserService currentUser;
    private final MembershipService membershipService;
    private final PaymentService paymentService;
    private final UserService userService;

    public UserAreaController(CurrentUserService currentUser, MembershipService membershipService,
                              PaymentService paymentService, UserService userService) {
        this.currentUser = currentUser;
        this.membershipService = membershipService;
        this.paymentService = paymentService;
        this.userService = userService;
    }

    @PostMapping("/memberships")
    @ResponseStatus(HttpStatus.CREATED)
    public MembershipResponse purchase(@Valid @RequestBody PurchaseRequest req) {
        User user = currentUser.requireCurrentUser();
        return MembershipResponse.from(membershipService.purchase(user, req));
    }

    @GetMapping("/me/memberships")
    public List<MembershipResponse> myMemberships() {
        User user = currentUser.requireCurrentUser();
        return membershipService.byUser(user.getId()).stream().map(MembershipResponse::from).toList();
    }

    @GetMapping("/me/payments")
    public List<PaymentResponse> myPayments() {
        User user = currentUser.requireCurrentUser();
        return paymentService.byUser(user.getId()).stream().map(PaymentResponse::from).toList();
    }

    @PatchMapping("/me")
    public UserResponse updateProfile(@RequestBody UserUpdateRequest req) {
        User user = currentUser.requireCurrentUser();
        return UserResponse.from(userService.updateProfile(user, req));
    }
}
