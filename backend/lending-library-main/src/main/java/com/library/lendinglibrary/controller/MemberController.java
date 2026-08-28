package com.library.lendinglibrary.controller;

import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.service.MemberService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    public Member register(@Valid @RequestBody MemberRequest request) {
        return memberService.register(request.name(), request.email(), request.phone(), request.address());
    }

    @GetMapping
    public List<Member> getAll() {
        return memberService.getAll();
    }

    @GetMapping("/{id}")
    public Member getById(@PathVariable UUID id) {
        return memberService.getById(id);
    }

    @PutMapping("/{id}/suspend")
    public Member suspend(@PathVariable UUID id) {
        return memberService.suspend(id);
    }

    @PutMapping("/{id}/reinstate")
    public Member reinstate(@PathVariable UUID id) {
        return memberService.reinstate(id);
    }

    public record MemberRequest(
            @NotBlank(message = "name is required") String name,
            @NotBlank(message = "email is required") @Email(message = "email must be valid") String email,
            String phone,
            String address
    ) {}
}