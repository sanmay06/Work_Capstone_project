package com.library.lendinglibrary.controller;

import com.library.lendinglibrary.model.Item;
import com.library.lendinglibrary.service.ItemService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public Item addItem(@Valid @RequestBody ItemRequest request) {
        return itemService.addItem(request.name(), request.description(), request.categoryId(), request.assetTag());
    }

    @GetMapping
    public List<Item> getAll() {
        return itemService.getAll();
    }

    @GetMapping("/search")
    public List<Item> search(@RequestParam String name) {
        return itemService.search(name);
    }

    @GetMapping("/available")
    public List<Item> getAvailable() {
        return itemService.getAvailable();
    }

    @GetMapping("/{id}")
    public Item getById(@PathVariable UUID id) {
        return itemService.getById(id);
    }

    @PutMapping("/{id}/retire")
    public Item retire(@PathVariable UUID id) {
        return itemService.retire(id);
    }

    public record ItemRequest(
            @NotBlank(message = "name is required") String name,
            String description,
            @NotNull(message = "categoryId is required") UUID categoryId,
            @NotBlank(message = "assetTag is required") String assetTag
    ) {}
}