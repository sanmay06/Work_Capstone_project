package com.library.lendinglibrary.service;

import com.library.lendinglibrary.exception.EmailAlreadyExistsException;
import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public Member register(String name, String email, String phone, String address, String rawPassword) {
        if (memberRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already registered");
        }
        Member member = Member.builder()
                .name(name)
                .email(email)
                .phone(phone)
                .address(address)
                .password(passwordEncoder.encode(rawPassword))
                .build();
        return memberRepository.save(member);
    }

    public List<Member> getAll(String status) {
        if (status == null || status.isBlank()) {
            return memberRepository.findAll();
        }
        return memberRepository.findAll()
                .stream()
                .filter(m -> status.equalsIgnoreCase(m.getStatus()))
                .toList();
    }

    public Member getById(UUID id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
    }

    public Member suspend(UUID id) {
        Member member = getById(id);
        member.setStatus("SUSPENDED");
        return memberRepository.save(member);
    }

    public Member reinstate(UUID id) {
        Member member = getById(id);
        member.setStatus("ACTIVE");
        return memberRepository.save(member);
    }
}