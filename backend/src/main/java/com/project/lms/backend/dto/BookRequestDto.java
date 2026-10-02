package com.project.lms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequestDto {

    private Long id;
    private String bookTitle;
    private String author;
    private String requestMessage;
    private Boolean isCompleted;
    private LocalDateTime createdAt;
    private Long memberId;
}
