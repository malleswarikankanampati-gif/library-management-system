package com.project.lms.backend.dto;

import com.project.lms.backend.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterMemberDto {
    private Long memberId;
    private String firstName;
    private String lastName;
    private String email;
    private Member.MembershipStatus status;
    private String username;
}
