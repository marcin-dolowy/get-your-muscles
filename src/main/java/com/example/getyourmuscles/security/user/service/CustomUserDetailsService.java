package com.example.getyourmuscles.security.user.service;

import com.example.getyourmuscles.security.user.model.CustomUserDetails;
import com.example.getyourmuscles.security.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Trying to load user with provided email: " + username);
        return userRepository.findByEmail(username).map(CustomUserDetails::new).orElseThrow(() -> {
            log.error("User with email: " + username + " not found");
            return new UsernameNotFoundException("User with email: " + username + " not found");
        });
    }
}
