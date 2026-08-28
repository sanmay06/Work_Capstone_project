package com.library.lendinglibrary.controller;

import com.library.lendinglibrary.model.Staff;
import com.library.lendinglibrary.service.StaffService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping
    public Staff create(@Valid @RequestBody StaffRequest request) {
        return staffService.create(request.name(), request.role(), request.email(), request.password());
    }

    @GetMapping
    public List<Staff> getAll() {
        return staffService.getAll();
    }

    @GetMapping("/{id}")
    public Staff getById(@PathVariable UUID id) {
        return staffService.getById(id);
    }

    public record StaffRequest(
            @NotBlank(message = "name is required") String name,
            @NotBlank(message = "role is required") String role,
            @NotBlank(message = "email is required") @Email(message = "email must be valid") String email,
            @NotBlank(message = "password is required") String password
    ) {}
}