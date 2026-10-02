package com.project.lms.backend.service.impl;

import com.project.lms.backend.entity.Member;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

public class MyUserDetails implements UserDetails {

    private final Member member;

    public MyUserDetails(Member member) {
        this.member = member;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return member.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        System.out.println(member.getPassword());
        return member.getPassword();
    }

    @Override
    public String getUsername() {
        return member.getUsername() == null ? member.getEmail() : member.getUsername();
    }

    public String getEmail() {
        return member.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return !member.getStatus().equals(Member.MembershipStatus.EXPIRED);
    }

    @Override
    public boolean isAccountNonLocked() {
        return member.getStatus().equals(Member.MembershipStatus.ACTIVE) || member.getStatus().equals(Member.MembershipStatus.EXPIRED);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
