package com.library.lendinglibrary.service;

import com.library.lendinglibrary.model.Category;
import com.library.lendinglibrary.model.Item;
import com.library.lendinglibrary.repository.CategoryRepository;
import com.library.lendinglibrary.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;

    public Item addItem(String name, String description, UUID categoryId, String assetTag) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Item item = Item.builder()
                .name(name)
                .description(description)
                .category(category)
                .assetTag(assetTag)
                .condition("GOOD")
                .status("AVAILABLE")
                .build();

        return itemRepository.save(item);
    }

    public List<Item> getAll() {
        return itemRepository.findAll();
    }

    public List<Item> search(String name) {
        return itemRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Item> getAvailable() {
        return itemRepository.findByStatus("AVAILABLE");
    }

    public Item getById(UUID id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
    }

    public Item retire(UUID id) {
        Item item = getById(id);
        item.setStatus("RETIRED");
        return itemRepository.save(item);
    }
}