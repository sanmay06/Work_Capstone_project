package com.library.lendinglibrary.service;

import com.library.lendinglibrary.model.Category;
import com.library.lendinglibrary.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category create(String name, Integer maxLoanDurationDays, boolean depositRequired) {
        Category category = Category.builder()
                .name(name)
                .maxLoanDurationDays(maxLoanDurationDays)
                .depositRequired(depositRequired)
                .build();
        return categoryRepository.save(category);
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category getById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }
}