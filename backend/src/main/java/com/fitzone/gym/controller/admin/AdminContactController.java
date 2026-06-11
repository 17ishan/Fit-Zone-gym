package com.fitzone.gym.controller.admin;

import com.fitzone.gym.dto.ContactDtos.ContactResponse;
import com.fitzone.gym.dto.ContactDtos.ContactUpdateRequest;
import com.fitzone.gym.dto.PageResponse;
import com.fitzone.gym.entity.ContactStatus;
import com.fitzone.gym.service.ContactService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/contacts")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContactController {

    private final ContactService contactService;

    public AdminContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public PageResponse<ContactResponse> list(@RequestParam(required = false) ContactStatus status,
                                              @PageableDefault(size = 20) Pageable pageable) {
        return PageResponse.of(contactService.list(status, pageable), ContactResponse::from);
    }

    @GetMapping("/{id}")
    public ContactResponse get(@PathVariable UUID id) {
        return ContactResponse.from(contactService.get(id));
    }

    @PatchMapping("/{id}")
    public ContactResponse update(@PathVariable UUID id, @RequestBody ContactUpdateRequest req) {
        return ContactResponse.from(contactService.updateStatus(id, req.status()));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        contactService.delete(id);
    }
}
