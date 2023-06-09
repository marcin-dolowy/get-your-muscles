package com.example.getyourmuscles.event.exception;

public class EventCreationInPastException extends RuntimeException {
    public EventCreationInPastException(String message) {
        super(message);
    }
}
