package com.example.getyourmuscles.event.repository;

import com.example.getyourmuscles.event.model.Event;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findEventsByMemberId(Long id);

    List<Event> findEventsByTrainerId(Long id);

    Optional<Event> findFirstByOrderByIdDesc();
}
