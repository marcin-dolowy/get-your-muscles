package com.example.getyourmuscles.global;

import com.example.getyourmuscles.event.exception.EventNotFoundException;
import com.example.getyourmuscles.event.exception.UnauthorizedOperationException;
import com.example.getyourmuscles.security.user.exception.EmailAlreadyExistsException;
import com.example.getyourmuscles.security.user.exception.EmptyFieldException;
import com.example.getyourmuscles.security.user.exception.InvalidEmailFormatException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
        EmailAlreadyExistsException.class,
        InvalidEmailFormatException.class,
        EmptyFieldException.class,
        EventNotFoundException.class,
        UnauthorizedOperationException.class
    })
    public ResponseEntity<String> handleEmailAlreadyExistsException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
