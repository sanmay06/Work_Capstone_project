package com.library.lendinglibrary.controller;

import com.library.lendinglibrary.config.JwtUtil;
import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.model.Staff;
import com.library.lendinglibrary.repository.MemberRepository;
import com.library.lendinglibrary.repository.StaffRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberRepository memberRepository;
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // Try member first
        Optional<Member> memberOpt = memberRepository.findByEmail(request.email());
        if (memberOpt.isPresent() && passwordEncoder.matches(request.password(), memberOpt.get().getPassword())) {
            String token = jwtUtil.generateToken(request.email(), "MEMBER");
            return new LoginResponse(token, "MEMBER", memberOpt.get().getId(), memberOpt.get().getName());
        }

        // Try staff
        Optional<Staff> staffOpt = staffRepository.findByEmail(request.email());
        if (staffOpt.isPresent() && passwordEncoder.matches(request.password(), staffOpt.get().getPassword())) {
            String role = staffOpt.get().getRole(); // "STAFF" or "ADMIN"
            String token = jwtUtil.generateToken(request.email(), role);
            return new LoginResponse(token, role, staffOpt.get().getId(), staffOpt.get().getName());
        }

        throw new IllegalArgumentException("Invalid email or password");
    }

    public record LoginRequest(
            @NotBlank(message = "email is required") String email,
            @NotBlank(message = "password is required") String password
    ) {}

    public record LoginResponse(String token, String role, UUID userId, String name) {}
}