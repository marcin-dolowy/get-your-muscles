package com.example.getyourmuscles.global;

import com.example.getyourmuscles.event.exception.EventNotFoundException;
import com.example.getyourmuscles.security.user.exception.EmailAlreadyExistsException;
import com.example.getyourmuscles.security.user.exception.EmptyFieldException;
import com.example.getyourmuscles.security.user.exception.InvalidEmailFormatException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<String> handleEmailAlreadyExistsException(EmailAlreadyExistsException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(InvalidEmailFormatException.class)
    public ResponseEntity<String> handleEventNotFoundException(InvalidEmailFormatException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(EmptyFieldException.class)
    public ResponseEntity<String> handleEventNotFoundException(EmptyFieldException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<String> handleEventNotFoundException(EventNotFoundException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
