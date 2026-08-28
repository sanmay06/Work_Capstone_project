package com.library.lendinglibrary.controller;

import com.library.lendinglibrary.model.Category;
import com.library.lendinglibrary.service.CategoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public Category create(@Valid @RequestBody CategoryRequest request) {
        return categoryService.create(request.name(), request.maxLoanDurationDays(), request.depositRequired());
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable UUID id) {
        return categoryService.getById(id);
    }

    public record CategoryRequest(
            @NotBlank(message = "name is required") String name,
            @NotNull(message = "maxLoanDurationDays is required")
            @Min(value = 1, message = "maxLoanDurationDays must be at least 1") Integer maxLoanDurationDays,
            boolean depositRequired
    ) {}
}