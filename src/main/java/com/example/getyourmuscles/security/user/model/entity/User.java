package com.example.getyourmuscles.security.user.model.entity;

import com.example.getyourmuscles.event.model.Event;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal trainingPrice;

    @Enumerated(value = EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Event> memberEvents;

    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Event> trainerEvents;
}
