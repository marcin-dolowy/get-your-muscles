package com.example.getyourmuscles;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class GetYourMusclesApplication {

    public static void main(String[] args) {
        SpringApplication.run(GetYourMusclesApplication.class, args);
        //        EnvironmentVariables environmentVariables = new EnvironmentVariables();
        //        System.out.println(environmentVariables.getJwtSecretKey());
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
