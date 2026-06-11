package com.fitzone.gym.service;

import com.fitzone.gym.config.AppProperties;
import com.fitzone.gym.entity.AdminAllowlistEntry;
import com.fitzone.gym.exception.BadRequestException;
import com.fitzone.gym.exception.NotFoundException;
import com.fitzone.gym.repository.AdminAllowlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AllowlistService {

    private final AdminAllowlistRepository repo;
    private final AppProperties props;

    public AllowlistService(AdminAllowlistRepository repo, AppProperties props) {
        this.repo = repo;
        this.props = props;
    }

    public boolean isAllowed(String email) {
        if (email == null) {
            return false;
        }
        String e = email.trim();
        boolean bootstrap = props.getAdmin().getBootstrapEmails().stream()
                .anyMatch(b -> b != null && b.trim().equalsIgnoreCase(e));
        return bootstrap || repo.existsByEmailIgnoreCase(e);
    }

    public List<AdminAllowlistEntry> list() {
        return repo.findAll();
    }

    @Transactional
    public AdminAllowlistEntry add(String email, String addedBy) {
        String e = email.trim().toLowerCase();
        if (repo.existsByEmailIgnoreCase(e)) {
            throw new BadRequestException("Email already in allowlist: " + e);
        }
        AdminAllowlistEntry entry = new AdminAllowlistEntry();
        entry.setEmail(e);
        entry.setAddedBy(addedBy);
        return repo.save(entry);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Allowlist entry not found: " + id);
        }
        repo.deleteById(id);
    }
}
