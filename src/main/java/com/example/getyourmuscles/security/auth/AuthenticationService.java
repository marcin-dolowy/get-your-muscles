package com.example.getyourmuscles.security.auth;

import com.example.getyourmuscles.security.config.jwt.JwtService;
import com.example.getyourmuscles.security.token.Token;
import com.example.getyourmuscles.security.token.TokenRepository;
import com.example.getyourmuscles.security.token.TokenType;
import com.example.getyourmuscles.security.user.exception.EmailAlreadyExistsException;
import com.example.getyourmuscles.security.user.exception.EmptyFieldException;
import com.example.getyourmuscles.security.user.exception.InvalidEmailFormatException;
import com.example.getyourmuscles.security.user.exception.UserNotFoundException;
import com.example.getyourmuscles.security.user.model.CustomUserDetails;
import com.example.getyourmuscles.security.user.model.entity.User;
import com.example.getyourmuscles.security.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AuthenticationResponse register(RegisterRequest request) {

        validateFieldsNotEmpty(request);
        validateEmailNotExists(request.getEmail());
        validateEmailFormat(request.getEmail());

        User user = createUserFromRequest(request);

        User savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(new CustomUserDetails(user));
        String refreshToken = jwtService.generateRefreshToken(new CustomUserDetails(user));

        saveUserToken(savedUser, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private User createUserFromRequest(RegisterRequest request) {
        return User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .trainingPrice(request.getTrainingPrice())
                .role(request.getRole())
                .build();
    }

    private boolean isSomeFieldsEmptyOrNull(RegisterRequest request) {
        Map<String, Object> requestMap = objectMapper.convertValue(request, new TypeReference<>() {});

        Predicate<Object> isNullOrEmpty =
                value -> value == null || String.valueOf(value).isEmpty();

        List<String> emptyFields = requestMap.entrySet().stream()
                .filter(entry -> isNullOrEmpty.test(entry.getValue()))
                .map(Map.Entry::getKey)
                .toList();

        log.warn("Empty fields found in the register form. List of empty values: {}", emptyFields);

        return requestMap.values().stream().anyMatch(value -> value == null || StringUtils.isEmpty(value.toString()));
    }

    private void validateEmailNotExists(String email) {
        log.warn("Email: ({}) already exists", email);
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
    }

    private void validateFieldsNotEmpty(RegisterRequest request) {
        if (isSomeFieldsEmptyOrNull(request)) {
            throw new EmptyFieldException("Some fields are empty");
        }
    }

    private void validateEmailFormat(String email) {
        log.warn("Invalid email format for: {}", email);
        if (!EmailValidator.getInstance().isValid(email)) {
            throw new InvalidEmailFormatException("Invalid email format. Please provide a valid email address");
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String jwtToken = jwtService.generateToken(new CustomUserDetails(user));
        String refreshToken = jwtService.generateRefreshToken(new CustomUserDetails(user));
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        List<Token> validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty()) return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            User user = this.userRepository.findByEmail(userEmail).orElseThrow();
            if (jwtService.isTokenValid(refreshToken, new CustomUserDetails(user))) {
                String accessToken = jwtService.generateToken(new CustomUserDetails(user));
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                AuthenticationResponse authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }
}
