package com.project.lms.backend.dto;

import com.project.lms.backend.entity.Member;
import com.project.lms.backend.entity.Member.MembershipStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {

    private Long memberId;
    private String firstName;
    private String lastName;
    private String email;
    private MembershipStatus status;
    private String username;
    private String password;
    private Boolean isPasswordSet;
    private Member.AuthProvider provider;
    private String providerCode;
    private String memberImg;
    private Set<String> roleNames;
    private LocalDateTime createdAt;
}