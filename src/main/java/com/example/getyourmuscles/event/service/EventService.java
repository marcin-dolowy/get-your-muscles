package com.example.getyourmuscles.event.service;

import com.example.getyourmuscles.event.exception.EventNotFoundException;
import com.example.getyourmuscles.event.exception.UnauthorizedOperationException;
import com.example.getyourmuscles.event.model.Event;
import com.example.getyourmuscles.event.model.EventSession;
import com.example.getyourmuscles.event.repository.EventRepository;
import com.example.getyourmuscles.security.auth.facade.IAuthenticationFacade;
import com.example.getyourmuscles.security.user.exception.UserNotFoundException;
import com.example.getyourmuscles.security.user.model.entity.User;
import com.example.getyourmuscles.security.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.function.Function;
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
    private final IAuthenticationFacade authenticationFacade;

    public Event findById(Long id) {
        log.info("Finding event by ID: {}", id);
        return eventRepository.findById(id).orElseThrow(() -> {
            log.warn("Event not found with ID: {}", id);
            return new EventNotFoundException("Event not found");
        });
    }

    public Long findLastEventId() {
        log.info("Finding ID for last event");
        return eventRepository
                .findFirstByOrderByIdDesc()
                .orElseThrow(() -> {
                    log.warn("Event not found");
                    return new EventNotFoundException("Event not found");
                })
                .getId();
    }

    public List<Event> findAll() {
        log.info("Finding all events");
        return eventRepository.findAll();
    }

    public List<Event> findEventsByMemberId(Long id) {
        log.info("Finding event by member ID: {}", id);
        return eventRepository.findEventsByMemberId(id);
    }

    public BigDecimal countTrainingPrice(EventSession eventSession) {
        User trainer = userRepository.findById(eventSession.getId()).orElseThrow(() -> {
            log.warn("User not found with ID: {}", eventSession.getId());
            return new UserNotFoundException("User not found");
        });

        BigDecimal trainingTime =
                calculateTrainingTimeInMinutes(eventSession, EventSession::getStartEvent, EventSession::getEndEvent);
        return trainer.getTrainingPrice().add(trainingTime);
    }

    public Event addEvent(Event event) {
        log.info("Adding event: {}", event);
        User trainer = userRepository.findById(event.getTrainer().getId()).orElseThrow(() -> {
            log.warn("User not found with ID: {}", event.getTrainer().getId());
            return new UserNotFoundException("User not found");
        });

        BigDecimal trainingTime = calculateTrainingTimeInMinutes(event, Event::getStartEvent, Event::getEndEvent);
        event.setPrice(trainer.getTrainingPrice().add(trainingTime));
        return eventRepository.save(event);
    }

    public static <T> BigDecimal calculateTrainingTimeInMinutes(
            T event, Function<T, LocalDateTime> getStartEvent, Function<T, LocalDateTime> getEndEvent) {
        LocalDateTime startEvent = getStartEvent.apply(event);
        LocalDateTime endEvent = getEndEvent.apply(event);
        return BigDecimal.valueOf(ChronoUnit.MINUTES.between(startEvent, endEvent));
    }

    public void deleteById(Long id) {
        Event existingEvent = getExistingEvent(id);

        String authenticatedUserEmail = authenticationFacade.getAuthentication().getName();
        String eventOwnerEmail = existingEvent.getMember().getEmail();

        if (authenticatedUserEmail.equals(eventOwnerEmail)) {
            log.info("Deleting event by ID: {}", id);
            eventRepository.deleteById(id);
        } else {
            log.warn(
                    "The owner of the event is a user with email: {}. Attempted event deletion by user with email: {}",
                    eventOwnerEmail,
                    authenticatedUserEmail);
            throw new UnauthorizedOperationException(
                    "You are not the owner of this event. You do not have permission to delete it.");
        }
    }

    @SneakyThrows
    public Event updateEvent(Long id, String updatedEvent) {
        Event existingEvent = getExistingEvent(id);

        String authenticatedUserEmail = authenticationFacade.getAuthentication().getName();
        String eventOwnerEmail = existingEvent.getMember().getEmail();

        if (authenticatedUserEmail.equals(eventOwnerEmail)) {
            objectMapper.readerForUpdating(existingEvent).readValue(updatedEvent);
            log.info("Updating event with ID: {}", id);
            return eventRepository.save(existingEvent);
        } else {
            log.warn(
                    "The owner of the event is a user with email: {}. Attempted event modification by user with email: {}",
                    eventOwnerEmail,
                    authenticatedUserEmail);
            throw new UnauthorizedOperationException(
                    "You are not the owner of this event. You do not have permission to update it.");
        }
    }

    private Event getExistingEvent(Long id) {
        return eventRepository.findById(id).orElseThrow(() -> {
            log.warn("Event not found with ID: {}", id);
            return new EventNotFoundException("Event not found with id: " + id);
        });
    }
}
