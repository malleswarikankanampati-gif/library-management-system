package com.project.lms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtDto {

    private String type = "Bearer ";
    private String token;
    private Long expiration;

    public JwtDto(String token, Long expiration) {
        this.token = token;
        this.expiration = System.currentTimeMillis() + expiration;
    }
}
