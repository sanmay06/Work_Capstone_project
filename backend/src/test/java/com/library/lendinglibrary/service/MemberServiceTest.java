package com.library.lendinglibrary.service;

import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock private MemberRepository memberRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private MemberService memberService;

    @Test
    void register_savesNewMemberWithHashedPassword() {
        when(passwordEncoder.encode(anyString())).thenReturn("hashed-password");
        when(memberRepository.save(any(Member.class))).thenAnswer(inv -> inv.getArgument(0));

        Member member = memberService.register("Test Member", "test@example.com", "9999999999", "Address", "plainPassword123");

        assertThat(member.getName()).isEqualTo("Test Member");
        assertThat(member.getEmail()).isEqualTo("test@example.com");
        assertThat(member.getPassword()).isEqualTo("hashed-password");
    }

    @Test
    void getById_throwsWhenNotFound() {
        UUID fakeId = UUID.randomUUID();
        when(memberRepository.findById(fakeId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> memberService.getById(fakeId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Member not found");
    }

    @Test
    void suspend_setsStatusSuspended() {
        UUID memberId = UUID.randomUUID();
        Member member = Member.builder().id(memberId).status("ACTIVE").build();

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
        when(memberRepository.save(any(Member.class))).thenAnswer(inv -> inv.getArgument(0));

        Member result = memberService.suspend(memberId);

        assertThat(result.getStatus()).isEqualTo("SUSPENDED");
    }
}