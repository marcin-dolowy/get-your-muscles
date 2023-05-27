package com.example.getyourmuscles.security.user.model.dto;

import com.example.getyourmuscles.event.model.Event;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private BigDecimal trainingPrice;
    private List<Event> memberEvents;
    private List<Event> trainerEvents;
}
