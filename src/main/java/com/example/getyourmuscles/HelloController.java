package com.example.getyourmuscles;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@Controller
public class HelloController {

    @Data
    class Event {
        private Long id;
        private String trainer;
        private String title;
        private String description;
        private LocalDateTime startEvent;
        private LocalDateTime endEvent;

        public Event(Long id, String trainer, String title, String description, LocalDateTime startEvent, LocalDateTime endEvent) {
            this.id = id;
            this.trainer = trainer;
            this.title = title;
            this.description = description;
            this.startEvent = startEvent;
            this.endEvent = endEvent;
        }
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<Event>> index() throws JsonProcessingException {
        List<Event> events = new ArrayList<>();
        Event event1 = new Event(
                3L,
                "Trainer 1",
                "Trening Ketli",
                "Troche siły potrzeba",
                LocalDateTime.of(2023, 2, 13, 9, 0),
                LocalDateTime.of(2023, 2, 13, 10, 0)
        );
        Event event2 = new Event(
                4L,
                "Trainer 2",
                "Kardio",
                "Bieganie plus rowerek",
                LocalDateTime.of(2023, 2, 15, 11, 0),
                LocalDateTime.of(2023, 2, 15, 12, 0)
        );
        events.add(event1);
        events.add(event2);

        return new ResponseEntity<>(events, HttpStatus.OK) ;
    }
}
