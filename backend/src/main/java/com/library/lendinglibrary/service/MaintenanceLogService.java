package com.library.lendinglibrary.service;

import com.library.lendinglibrary.model.Item;
import com.library.lendinglibrary.model.MaintenanceLog;
import com.library.lendinglibrary.model.Staff;
import com.library.lendinglibrary.repository.ItemRepository;
import com.library.lendinglibrary.repository.MaintenanceLogRepository;
import com.library.lendinglibrary.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaintenanceLogService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final ItemRepository itemRepository;
    private final StaffRepository staffRepository;

    public MaintenanceLog logMaintenance(UUID itemId, UUID staffId, String notes) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        item.setStatus("MAINTENANCE");
        itemRepository.save(item);

        MaintenanceLog log = MaintenanceLog.builder()
                .item(item)
                .performedBy(staff)
                .notes(notes)
                .build();

        return maintenanceLogRepository.save(log);
    }

    public List<MaintenanceLog> getAll() {
        return maintenanceLogRepository.findAll();
    }
}