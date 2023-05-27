package com.example.getyourmuscles.security.user.model.mapper;

import com.example.getyourmuscles.security.user.model.dto.UserDto;
import com.example.getyourmuscles.security.user.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserModelMapper {
    private final ModelMapper modelMapper;

    public UserDto toDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }
}
