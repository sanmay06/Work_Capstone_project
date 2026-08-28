package com.library.lendinglibrary.controller;

import com.library.lendinglibrary.model.MaintenanceLog;
import com.library.lendinglibrary.service.MaintenanceLogService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceLogController {

    private final MaintenanceLogService maintenanceLogService;

    @PostMapping
    public MaintenanceLog logMaintenance(@Valid @RequestBody MaintenanceRequest request) {
        return maintenanceLogService.logMaintenance(request.itemId(), request.staffId(), request.notes());
    }

    @GetMapping
    public List<MaintenanceLog> getAll() {
        return maintenanceLogService.getAll();
    }

    public record MaintenanceRequest(
            @NotNull(message = "itemId is required") UUID itemId,
            @NotNull(message = "staffId is required") UUID staffId,
            String notes
    ) {}
}