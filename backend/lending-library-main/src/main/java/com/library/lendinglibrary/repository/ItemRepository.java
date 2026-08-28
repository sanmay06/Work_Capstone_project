package com.library.lendinglibrary.repository;



import com.library.lendinglibrary.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {
    List<Item> findByStatus(String status);
    List<Item> findByNameContainingIgnoreCase(String name);
}
