package com.project.lms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthorDto {
    
    private Long authorId;
    private String name;
    private String biography;
    private Date dob;
    private String authorImg;
}
