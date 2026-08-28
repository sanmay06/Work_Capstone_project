package com.library.lendinglibrary.controller;

import com.library.lendinglibrary.model.Member;
import com.library.lendinglibrary.service.MemberService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    public MemberResponse register(@Valid @RequestBody MemberRequest request) {
        Member member = memberService.register(
                request.name(),
                request.email(),
                request.phone(),
                request.address(),
                request.password()
        );
        return toResponse(member);
    }

    @GetMapping
    public List<MemberResponse> getAll(@RequestParam(required = false) String status) {
        return memberService.getAll(status).stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public MemberResponse getById(@PathVariable UUID id) {
        return toResponse(memberService.getById(id));
    }

    @PutMapping("/{id}/suspend")
    public MemberResponse suspend(@PathVariable UUID id) {
        return toResponse(memberService.suspend(id));
    }

    @PutMapping("/{id}/reinstate")
    public MemberResponse reinstate(@PathVariable UUID id) {
        return toResponse(memberService.reinstate(id));
    }

    private MemberResponse toResponse(Member m) {
        return new MemberResponse(
                m.getId(),
                m.getName(),
                m.getEmail(),
                m.getPhone(),
                m.getAddress(),
                m.getStatus(),
                m.getJoinDate()
        );
    }

    public record MemberRequest(
            @NotBlank(message = "name is required")
            @Size(min = 2, max = 100, message = "name must be between 2 and 100 characters")
            String name,

            @NotBlank(message = "email is required")
            @Email(message = "email must be valid")
            @Size(max = 150, message = "email must be under 150 characters")
            String email,

            @Pattern(regexp = "^$|^\\+?[0-9]{7,15}$", message = "phone must be 7-15 digits, optionally starting with +")
            String phone,

            @Size(max = 255, message = "address must be under 255 characters")
            String address,

            @NotBlank(message = "password is required")
            @Size(min = 6, max = 100, message = "password must be at least 6 characters")
            String password
    ) {}

    public record MemberResponse(
            UUID id,
            String name,
            String email,
            String phone,
            String address,
            String status,
            LocalDate joinDate
    ) {}
}