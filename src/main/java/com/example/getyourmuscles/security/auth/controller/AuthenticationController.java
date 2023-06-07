package com.example.getyourmuscles.security.auth.controller;

import com.example.getyourmuscles.security.auth.model.AuthenticationRequest;
import com.example.getyourmuscles.security.auth.model.AuthenticationResponse;
import com.example.getyourmuscles.security.auth.model.RegisterRequest;
import com.example.getyourmuscles.security.auth.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @SneakyThrows
    @PostMapping("/logout")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        authenticationService.refreshToken(request, response);
    }
}
