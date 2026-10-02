package com.project.lms.backend.exception;

import com.project.lms.backend.dto.ErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import java.text.SimpleDateFormat;
import java.util.Date;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FileSaveException.class)
    public ResponseEntity<ErrorDto> handleFileSaveException(Exception e, WebRequest request) {
        HttpStatus httpStatus = getHttpStatus(e);
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formattedDate = formatter.format(date);

        ErrorDto errorDto = new ErrorDto(
                e.getMessage(),
                request.getDescription(false).replace("uri=", ""),
                formattedDate
        );

        return new ResponseEntity<>(errorDto, httpStatus);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDto> handleResourceNotFoundException(Exception e, WebRequest request) {
        HttpStatus httpStatus = getHttpStatus(e);
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formattedDate = formatter.format(date);

        ErrorDto errorDto = new ErrorDto(
                e.getMessage(),
                request.getDescription(false).replace("uri=", ""),
                formattedDate
        );

        return new ResponseEntity<>(errorDto, httpStatus);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleException(Exception e, WebRequest request) {
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formattedDate = formatter.format(date);

        ErrorDto errorDto = new ErrorDto(
                e.getMessage(),
                request.getDescription(false).replace("uri=", ""),
                formattedDate
        );

        return new ResponseEntity<>(errorDto, httpStatus);
    }


    private HttpStatus getHttpStatus(Exception exception) {
        ResponseStatus responseStatusAnnotation = exception.getClass().getAnnotation(ResponseStatus.class);
        if (responseStatusAnnotation != null) {
            return responseStatusAnnotation.value();
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
