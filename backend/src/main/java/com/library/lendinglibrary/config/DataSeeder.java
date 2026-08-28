package com.library.lendinglibrary.config;

import com.library.lendinglibrary.model.Staff;
import com.library.lendinglibrary.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (staffRepository.findByEmail("admin@example.com").isEmpty()) {
            Staff admin = Staff.builder()
                    .name("Admin User")
                    .role("ADMIN")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("adminpass123"))
                    .build();
            staffRepository.save(admin);
            System.out.println("=== Seeded default admin: admin@example.com / adminpass123 ===");
        }
    }
}