package com.project.lms.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class CustomAuthException extends RuntimeException {
    
    public CustomAuthException(String message) {
        super(message);
    }
}
