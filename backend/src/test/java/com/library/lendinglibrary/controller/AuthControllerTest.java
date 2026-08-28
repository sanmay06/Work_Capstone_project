package com.library.lendinglibrary.controller;


import com.library.lendinglibrary.config.JwtUtil;
import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.model.Staff;
import com.library.lendinglibrary.repository.MemberRepository;
import com.library.lendinglibrary.repository.StaffRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private MemberRepository memberRepository;
    @Mock private StaffRepository staffRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks
    private AuthController authController;

    @Test
    void login_succeedsForValidMember() {
        Member member = Member.builder()
                .email("member@example.com")
                .password("hashed-password")
                .build();

        when(memberRepository.findByEmail("member@example.com")).thenReturn(Optional.of(member));
        when(passwordEncoder.matches("plainPassword", "hashed-password")).thenReturn(true);
        when(jwtUtil.generateToken("member@example.com", "MEMBER")).thenReturn("fake-jwt-token");

        AuthController.LoginRequest request = new AuthController.LoginRequest("member@example.com", "plainPassword");
        AuthController.LoginResponse response = authController.login(request);

        assertThat(response.token()).isEqualTo("fake-jwt-token");
        assertThat(response.role()).isEqualTo("MEMBER");
    }

    @Test
    void login_succeedsForValidStaff() {
        Staff staff = Staff.builder()
                .email("staff@example.com")
                .password("hashed-password")
                .role("STAFF")
                .build();

        when(memberRepository.findByEmail("staff@example.com")).thenReturn(Optional.empty());
        when(staffRepository.findByEmail("staff@example.com")).thenReturn(Optional.of(staff));
        when(passwordEncoder.matches("plainPassword", "hashed-password")).thenReturn(true);
        when(jwtUtil.generateToken("staff@example.com", "STAFF")).thenReturn("fake-jwt-token");

        AuthController.LoginRequest request = new AuthController.LoginRequest("staff@example.com", "plainPassword");
        AuthController.LoginResponse response = authController.login(request);

        assertThat(response.token()).isEqualTo("fake-jwt-token");
        assertThat(response.role()).isEqualTo("STAFF");
    }

    @Test
    void login_throwsWhenEmailNotFoundAnywhere() {
        when(memberRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());
        when(staffRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

        AuthController.LoginRequest request = new AuthController.LoginRequest("nobody@example.com", "anyPassword");

        assertThatThrownBy(() -> authController.login(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void login_throwsWhenPasswordIncorrect() {
        Member member = Member.builder()
                .email("member@example.com")
                .password("hashed-password")
                .build();

        when(memberRepository.findByEmail("member@example.com")).thenReturn(Optional.of(member));
        when(passwordEncoder.matches("wrongPassword", "hashed-password")).thenReturn(false);
        when(staffRepository.findByEmail("member@example.com")).thenReturn(Optional.empty());

        AuthController.LoginRequest request = new AuthController.LoginRequest("member@example.com", "wrongPassword");

        assertThatThrownBy(() -> authController.login(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid email or password");
    }
}
