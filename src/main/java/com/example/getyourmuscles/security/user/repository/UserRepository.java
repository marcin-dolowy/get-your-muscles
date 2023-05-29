package com.example.getyourmuscles.security.user.repository;

import com.example.getyourmuscles.security.user.model.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findUserByEmail(String email);
}
