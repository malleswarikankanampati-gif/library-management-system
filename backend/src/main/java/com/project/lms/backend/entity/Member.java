package com.project.lms.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@ToString
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "email", unique = true, nullable = false, length = 150)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private MembershipStatus status = MembershipStatus.ACTIVE;

    @Column(name = "username", unique = true, nullable = true, length = 50)
    private String username;

    @Column(name = "password", nullable = true)
    private String password;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider = AuthProvider.LOCAL;

    private String providerCode;

    private String memberImg;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "member_roles", joinColumns = @JoinColumn(name = "memberId"), inverseJoinColumns = @JoinColumn(name = "RoleId"))
    private Set<Role> roles;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<BookRequest> bookRequests;

    @ToString.Exclude
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Wishlist> wishlists;

    @ToString.Exclude
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Borrow> borrows;

    @ToString.Exclude
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<BorrowHistory> borrowHistories;

    public enum MembershipStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED,
        EXPIRED
    }

    public enum AuthProvider {
        LOCAL, GOOGLE, MICROSOFT
    }
}