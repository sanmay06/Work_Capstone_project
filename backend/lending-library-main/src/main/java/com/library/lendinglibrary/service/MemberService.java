package com.library.lendinglibrary.service;

import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public Member register(String name, String email, String phone, String address) {
        Member member = Member.builder()
                .name(name)
                .email(email)
                .phone(phone)
                .address(address)
                .build();
        return memberRepository.save(member);
    }

    public List<Member> getAll() {
        return memberRepository.findAll();
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