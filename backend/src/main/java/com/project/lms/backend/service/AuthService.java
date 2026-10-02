package com.project.lms.backend.service;

import com.project.lms.backend.dto.*;
import com.project.lms.backend.entity.Member;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AuthService {

    String registerNaw(MemberDto memberDto);

    JwtDto login(LoginDto loginDto);

    MemberDto getMemberDetails();

    String getCurrentUsername();

    MemberDto updateSelf(MemberDto memberDto);

    Boolean validatePassword(String password);

    void deleteSelf();

    void passwordChange(PasswordChangeDto passwordChangeDto);

    void updateProfilePic(MultipartFile memberImg);

    void deleteProfilePic();

    List<MemberDto> getAllMembers(FilterMemberDto filterMemberDto);

    MemberDto getOtherMemberDetails(Long memberId);

    Member.MembershipStatus updateOtherStatus(MemberDto memberDto);

    MemberDto updateUserNameSelf(String username);

    MemberDto setPasswordSelf(String password);
}
