package com.example.getyourmuscles.security.auth;

import com.example.getyourmuscles.security.user.model.entity.Role;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String firstName;
    private String lastName;
    private BigDecimal trainingPrice;
    private String email;
    private String password;
    private Role role;
}
