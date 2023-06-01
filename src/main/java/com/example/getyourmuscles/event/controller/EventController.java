package com.example.getyourmuscles.event.controller;

import com.example.getyourmuscles.event.model.Event;
import com.example.getyourmuscles.event.model.EventSession;
import com.example.getyourmuscles.event.service.EventService;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/events")
public class EventController {
    private final EventService eventService;

    @GetMapping("/{id}")
    public ResponseEntity<Event> findById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.findById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Event>> findAll() {
        return ResponseEntity.ok(eventService.findAll());
    }

    @GetMapping("/member/{id}")
    public ResponseEntity<List<Event>> findEventsByMemberId(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.findEventsByMemberId(id));
    }

    @PostMapping("/add")
    public ResponseEntity<Event> addEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.addEvent(event));
    }

    @GetMapping("/price")
    public ResponseEntity<BigDecimal> countTrainingPrice(@RequestBody EventSession eventSession) {
        return ResponseEntity.ok(eventService.countTrainingPrice(eventSession));
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        eventService.deleteById(id);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody String updatedEvent) {
        return ResponseEntity.ok(eventService.updateEvent(id, updatedEvent));
    }
}
