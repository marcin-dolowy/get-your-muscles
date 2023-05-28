package com.example.getyourmuscles.event.service;

import com.example.getyourmuscles.event.model.Event;
import com.example.getyourmuscles.event.repository.EventRepository;
import com.example.getyourmuscles.security.user.model.entity.User;
import com.example.getyourmuscles.security.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public Event findById(Long id) {
        log.info("Finding event by ID: {}", id);
        return eventRepository.findById(id).orElseThrow(() -> {
            log.warn("Event not found with ID: {}", id);
            return new NoSuchElementException("Event not found");
        });
    }

    public List<Event> findAll() {
        log.info("Finding all events");
        return eventRepository.findAll();
    }

    public Event addEvent(Event event) {
        log.info("Adding event: {}", event);
        User trainer = userRepository.findById(event.getTrainer().getId()).orElseThrow(() -> {
            log.warn("User not found with ID: {}", event.getTrainer().getId());
            return new NoSuchElementException("User not found");
        });

        BigDecimal trainingPrice = trainer.getTrainingPrice();
        BigDecimal trainingTime =
                BigDecimal.valueOf(ChronoUnit.MINUTES.between(event.getStartEvent(), event.getEndEvent()));
        event.setPrice(trainingPrice.add(trainingTime));
        return eventRepository.save(event);
    }

    public void deleteById(Long id) {
        log.info("Deleting event by ID: {}", id);
        eventRepository.deleteById(id);
    }

    @SneakyThrows
    public Event updateEvent(Long id, String updatedEvent) {
        Event existingEvent = eventRepository.findById(id).orElseThrow(() -> {
            log.warn("Event not found with ID: {}", id);
            return new RuntimeException("Event not found with id: " + id);
        });

        objectMapper.readerForUpdating(existingEvent).readValue(updatedEvent);
        return eventRepository.save(existingEvent);
    }
}
