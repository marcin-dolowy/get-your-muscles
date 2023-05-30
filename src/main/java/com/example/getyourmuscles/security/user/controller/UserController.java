package com.example.getyourmuscles.security.user.controller;

import com.example.getyourmuscles.security.user.model.dto.UserDto;
import com.example.getyourmuscles.security.user.service.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping("/find/{email}")
    public ResponseEntity<UserDto> findUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.findUserByEmail(email));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDto>> findAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/all/trainers")
    public ResponseEntity<List<UserDto>> findAllTrainers() {
        return ResponseEntity.ok(userService.findAllTrainers());
    }

    @GetMapping("/all/members")
    public ResponseEntity<List<UserDto>> findALlMembers() {
        return ResponseEntity.ok(userService.findAllMembers());
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
