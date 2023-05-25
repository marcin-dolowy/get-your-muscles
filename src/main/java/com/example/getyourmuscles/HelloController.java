package com.example.getyourmuscles;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@Controller
public class HelloController {

    @Data
    class Reservation {
        private int id;
        private String subject;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private boolean isAllDay;

        public Reservation(int id, String subject, LocalDateTime startTime, LocalDateTime endTime, boolean isAllDay) {
            this.id = id;
            this.subject = subject;
            this.startTime = startTime;
            this.endTime = endTime;
            this.isAllDay = isAllDay;
        }
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<Reservation>> index() throws JsonProcessingException {
        List<Reservation> reservations = new ArrayList<>();
        Reservation reservation1 = new Reservation(
                3,
                "Testing",
                LocalDateTime.of(2023, 2, 13, 9, 0),
                LocalDateTime.of(2023, 2, 13, 10, 0),
                false
        );
        Reservation reservation2 = new Reservation(
                4,
                "Vacation",
                LocalDateTime.of(2023, 2, 15, 11, 0),
                LocalDateTime.of(2023, 2, 15, 12, 0),
                false
        );
        reservations.add(reservation1);
        reservations.add(reservation2);

        return new ResponseEntity<>(reservations, HttpStatus.OK) ;
    }
}
