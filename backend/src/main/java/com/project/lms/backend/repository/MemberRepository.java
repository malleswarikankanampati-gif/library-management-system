package com.project.lms.backend.repository;

import com.project.lms.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmailOrUsername(String email, String username);

    Optional<Member> findByEmail(String email);

    Optional<Member> findByUsername(String username);

    @Query("SELECT m FROM Member m WHERE m.username = ?1 AND m.memberId <> ?2")
    List<Member> findByUsernameExceptOne(String username, Long memberId);

    @Query("SELECT m FROM Member m WHERE m.email = ?1 AND m.memberId <> ?2")
    List<Member> findByEmailExceptOne(String email, Long memberId);

    List<Member> findAllByOrderByFirstNameAscLastNameAscMemberIdAsc();

    @Query("""
                SELECT m
                FROM Member m
                WHERE (:status IS NULL OR m.status = :status)
                  AND (
                        :firstName IS NULL OR :firstName = '' 
                        OR LOWER(m.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))
                      )
                  AND (
                        :lastName IS NULL OR :lastName = '' 
                        OR LOWER(m.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))
                      )
                ORDER BY m.firstName ASC, m.lastName ASC, m.memberId ASC
            """)
    List<Member> findAllByDrawerFilters(
            @Param("status") Member.MembershipStatus status,
            @Param("firstName") String firstName,
            @Param("lastName") String lastName
    );
}
