package com.example.getyourmuscles.security.user.service;

import com.example.getyourmuscles.security.user.exception.UserNotFoundException;
import com.example.getyourmuscles.security.user.model.dto.UserDto;
import com.example.getyourmuscles.security.user.model.mapper.UserModelMapper;
import com.example.getyourmuscles.security.user.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserModelMapper userModelMapper;

    public UserDto findById(Long id) {
        log.info("Finding user by ID: {}", id);
        return userRepository.findById(id).map(userModelMapper::toDto).orElseThrow(() -> {
            log.warn("User not found with ID: {}", id);
            return new UserNotFoundException("User not found");
        });
    }

    public UserDto findUserByEmail(String email) {
        return userRepository.findUserByEmail(email).map(userModelMapper::toDto).orElseThrow(() -> {
            log.warn("User not found with email: {}", email);
            return new UserNotFoundException("User not found");
        });
    }

    public List<UserDto> findAll() {
        log.info("Finding all users");
        return userRepository.findAll().stream().map(userModelMapper::toDto).toList();
    }

    public void deleteById(Long id) {
        log.info("Deleting user by ID: {}", id);
        userRepository.deleteById(id);
        log.info("User deleted successfully");
    }
}
