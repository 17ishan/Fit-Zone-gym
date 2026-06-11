package com.fitzone.gym.repository;

import com.fitzone.gym.entity.ContactStatus;
import com.fitzone.gym.entity.ContactSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, UUID> {

    Page<ContactSubmission> findByStatus(ContactStatus status, Pageable pageable);

    long countByStatus(ContactStatus status);
}
