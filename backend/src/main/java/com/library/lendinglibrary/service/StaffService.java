package com.library.lendinglibrary.service;

import com.library.lendinglibrary.model.Staff;
import com.library.lendinglibrary.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    public Staff create(String name, String role, String email, String rawPassword) {
        Staff staff = Staff.builder()
                .name(name)
                .role(role)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .build();
        return staffRepository.save(staff);
    }

    public List<Staff> getAll() {
        return staffRepository.findAll();
    }

    public Staff getById(UUID id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));
    }
}