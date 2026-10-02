package com.project.lms.backend.dto;

import com.project.lms.backend.entity.BorrowHistory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BorrowHistoryDto {

    private Long borrowHistoryId;
    private Long memberId;
    private String firstName;
    private String lastName;
    private Long bookId;
    private String title;
    private Long authorId;
    private String authorName;
    private BorrowHistory.ActivityType activityType;
    private LocalDateTime createdAt;
    private Long borrowedDays;

    public BorrowHistoryDto(Long memberId, Long bookId, BorrowHistory.ActivityType activityType, Long borrowedDays) {
        this.memberId = memberId;
        this.bookId = bookId;
        this.activityType = activityType;
        this.borrowedDays = borrowedDays;
    }
}
