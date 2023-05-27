package com.example.getyourmuscles.security.user;

import com.example.getyourmuscles.security.user.exception.UserNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User findById(Long id) {
        log.info("Finding user by ID: {}", id);
        return userRepository.findById(id).orElseThrow(() -> {
            log.warn("User not found with ID: {}", id);
            return new UserNotFoundException("User not found");
        });
    }

    public List<User> findAll() {
        log.info("Finding all users");
        return userRepository.findAll();
    }

    public void deleteById(Long id) {
        log.info("Deleting user by ID: {}", id);
        userRepository.deleteById(id);
        log.info("User deleted successfully");
    }
}
