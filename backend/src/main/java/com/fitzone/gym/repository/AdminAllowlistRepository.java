package com.fitzone.gym.repository;

import com.fitzone.gym.entity.AdminAllowlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminAllowlistRepository extends JpaRepository<AdminAllowlistEntry, Long> {

    boolean existsByEmailIgnoreCase(String email);
}
