package com.project.lms.backend.service.impl;

import com.project.lms.backend.dto.*;
import com.project.lms.backend.entity.Member;
import com.project.lms.backend.entity.Role;
import com.project.lms.backend.exception.CustomAuthException;
import com.project.lms.backend.exception.ResourceNotFoundException;
import com.project.lms.backend.mapper.BookMapper;
import com.project.lms.backend.repository.MemberRepository;
import com.project.lms.backend.repository.RoleRepository;
import com.project.lms.backend.service.AuthService;
import com.project.lms.backend.service.jwt.JwtService;
import com.project.lms.backend.util.InputOutput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final MemberRepository memberRepository;
    private final RoleRepository roleRepository;
    private final BookMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Autowired
    public AuthServiceImpl(MemberRepository memberRepository,
                           RoleRepository roleRepository,
                           BookMapper modelMapper,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtService jwtService) {
        this.memberRepository = memberRepository;
        this.roleRepository = roleRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public String registerNaw(MemberDto memberDto) {
        if (isUsernameOrEmailMissing(memberDto.getUsername(), memberDto.getEmail())) {
            throw new IllegalArgumentException("Username or Email cannot be empty");
        }
        if (lessThanFourNonSpaceChars(memberDto.getPassword())) {
            throw new IllegalArgumentException("Password must be at least 4 characters long");
        }
        if (memberDto.getUsername().length() < 3 || memberDto.getUsername().length() > 30) {
            throw new IllegalArgumentException("Username must be between 3 and 30 characters long");
        }
        if (!memberDto.getUsername().matches("^[a-zA-Z0-9_.-]+$")) {
            throw new IllegalArgumentException("Username can only contain letters, digits, underscores (_), dots (.), or hyphens (-)");
        }


        memberRepository.findByEmailOrUsername(memberDto.getEmail(), memberDto.getUsername()).ifPresent(
                member -> {
                    throw new RuntimeException("Email or username already exists");
                }
        );

        Member member = modelMapper.map(memberDto, Member.class);
        member.setPassword(passwordEncoder.encode(member.getPassword()));
        if (member.getStatus() == null) {
            member.setStatus(Member.MembershipStatus.ACTIVE);
        }

        Role role = roleRepository.findByName(Role.ERole.ROLE_MEMBER).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        member.setRoles(Set.of(role));

        memberRepository.save(member);
        return "SUCCESS";
    }

    @Override
    public JwtDto login(LoginDto loginDto) {
        if (isUsernameOrEmailMissing(loginDto.getUsername(), loginDto.getPassword())) {
            throw new IllegalArgumentException("Username or Password cannot be empty");
        }

        Member member = memberRepository.findByEmailOrUsername(loginDto.getUsername(), loginDto.getUsername()).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with username: " + loginDto.getUsername()));

        if (member.getPassword() == null && member.getProvider() != Member.AuthProvider.LOCAL) {
            throw new CustomAuthException("Looks like you signed up with " +
                    member.getProvider() + ". Please use that to log in and then reset your password.");
        }

        if (!passwordEncoder.matches(loginDto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("Password is incorrect");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        System.out.println(">>>>>> JWT TOKEN GENERATED <<<<<<");
        return new JwtDto(jwtService.generateToken(loginDto.getUsername()), expiration - 10000);
    }

    @Override
    public MemberDto getMemberDetails() {
        String username = getCurrentUsername();
        if (isNullOrBlank(username)) {
            throw new IllegalArgumentException("Username passed is NULL");
        }
        Member member = memberRepository.findByEmailOrUsername(username, username).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with username: " + username));

        return modelMapper.MemberEntityToDto(member);
    }

    @Override
    public String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            Object principal = auth.getPrincipal();
            return principal instanceof UserDetails
                    ? ((UserDetails) principal).getUsername()
                    : principal.toString();
        }
        return "";
    }

    @Override
    public Boolean validatePassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password must not be blank");
        }

        String username = getCurrentUsername();
        Member member = memberRepository.findByEmailOrUsername(username, username).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with username: " + username));

        return passwordEncoder.matches(password, member.getPassword());
    }

    @Override
    public void deleteSelf() {
        String username = getCurrentUsername();
        Member member = memberRepository.findByEmailOrUsername(username, username).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with username: " + username));
        memberRepository.delete(member);
    }

    @Override
    public void passwordChange(PasswordChangeDto passwordChangeDto) {
        if (!validatePassword(passwordChangeDto.getCurrentPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        if (lessThanFourNonSpaceChars(passwordChangeDto.getNewPassword())) {
            throw new IllegalArgumentException("New password must be at least 4 characters long");
        }
        if (!passwordChangeDto.getNewPassword().equals(passwordChangeDto.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }
        if (passwordChangeDto.getNewPassword().equals(passwordChangeDto.getCurrentPassword())) {
            throw new IllegalArgumentException("New password cannot be the same as current password");
        }

        String username = getCurrentUsername();
        Member member = memberRepository.findByEmailOrUsername(username, username).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with username: " + username));

        member.setPassword(passwordEncoder.encode(passwordChangeDto.getNewPassword()));
        memberRepository.save(member);
    }

    @Override
    public void updateProfilePic(MultipartFile memberImg) {
        String username = getCurrentUsername();
        Member member = memberRepository.findByEmailOrUsername(username, username).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with username: " + username));

        String imgDir = "/images/members/" + member.getMemberId();
        String imageName = InputOutput.saveImageToDir("." + imgDir, memberImg);
        member.setMemberImg(imgDir + "/" + imageName);
        memberRepository.save(member);
    }

    @Override
    public void deleteProfilePic() {
        String username = getCurrentUsername();
        Member member = memberRepository.findByEmailOrUsername(username, username).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with username: " + username));
        if (isNullOrBlank(member.getMemberImg())) {
            throw new IllegalArgumentException("Profile picture does not exist");
        }

        member.setMemberImg(null);
        memberRepository.save(member);
    }

    @Override
    public List<MemberDto> getAllMembers(FilterMemberDto filterMemberDto) {
        if (!checkValidEmail(filterMemberDto.getEmail())) {
            throw new IllegalArgumentException("Email is not valid");
        }
        if (filterMemberDto.getMemberId() != null) {
            Member member = memberRepository.findById(filterMemberDto.getMemberId()).orElseThrow(
                    () -> new ResourceNotFoundException("Member not found with Member ID: " + filterMemberDto.getMemberId()));
            return List.of(modelMapper.MemberEntityToDto(member));
        }
        if (filterMemberDto.getUsername() != null && !isNullOrBlank(filterMemberDto.getUsername().trim())) {
            Member member = memberRepository.findByUsername(filterMemberDto.getUsername().trim()).orElseThrow(
                    () -> new ResourceNotFoundException("Member not found with Username: " + filterMemberDto.getUsername()));
            return List.of(modelMapper.MemberEntityToDto(member));
        }
        if (!isNullOrBlank(filterMemberDto.getEmail())) {
            Member member = memberRepository.findByEmail(filterMemberDto.getEmail()).orElseThrow(
                    () -> new ResourceNotFoundException("Member not found with Email: " + filterMemberDto.getEmail()));
            return List.of(modelMapper.MemberEntityToDto(member));
        }
        if (filterMemberDto.getStatus() != null ||
                (filterMemberDto.getFirstName() != null && !isNullOrBlank(filterMemberDto.getFirstName().trim())) ||
                (filterMemberDto.getLastName() != null && !isNullOrBlank(filterMemberDto.getLastName().trim()))
        ) {
            List<Member> members = memberRepository.findAllByDrawerFilters(filterMemberDto.getStatus(), filterMemberDto.getFirstName().trim(), filterMemberDto.getLastName().trim());
            return members.stream().map(modelMapper::MemberEntityToDto).collect(Collectors.toList());
        }

        List<Member> members = memberRepository.findAllByOrderByFirstNameAscLastNameAscMemberIdAsc();
        return members.stream().map(modelMapper::MemberEntityToDto).collect(Collectors.toList());
    }

    @Override
    public MemberDto getOtherMemberDetails(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with ID: " + memberId));
        return modelMapper.MemberEntityToDto(member);
    }

    @Override
    public Member.MembershipStatus updateOtherStatus(MemberDto memberDto) {
        if (memberDto.getMemberId() == null) {
            throw new IllegalArgumentException("Member ID cannot be null");
        }
        Member member = memberRepository.findById(memberDto.getMemberId()).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with Member ID: " + memberDto.getMemberId()));
        if (member.getStatus() == memberDto.getStatus()) {
            throw new IllegalArgumentException("Status cannot be the same");
        }

        member.setStatus(memberDto.getStatus());
        Member save = memberRepository.save(member);
        return save.getStatus();
    }

    @Override
    public MemberDto updateUserNameSelf(String username) {
        if (username.length() < 3 || username.length() > 30) {
            throw new IllegalArgumentException("Username must be between 3 and 30 characters long");
        }
        if (!username.matches("^[a-zA-Z0-9_.-]+$")) {
            throw new IllegalArgumentException("Username can only contain letters, digits, underscores (_), dots (.), or hyphens (-)");
        }

        boolean usernameFlag = memberRepository.findByUsername(username).isPresent();
        if (usernameFlag) {
            throw new RuntimeException("Username already exists");
        }

        String email = getCurrentUsername();
        Member member = memberRepository.findByEmailOrUsername(email, email).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with email: " + email));

        if (!isNullOrBlank(member.getUsername())) {
            throw new RuntimeException("Username already present for this user");
        }

        member.setUsername(username);
        return modelMapper.MemberEntityToDto(memberRepository.save(member));
    }

    @Override
    public MemberDto setPasswordSelf(String password) {
        if (lessThanFourNonSpaceChars(password)) {
            throw new IllegalArgumentException("Password must be at least 4 characters long");
        }

        String username = getCurrentUsername();
        Member member = memberRepository.findByEmailOrUsername(username, username).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with username: " + username));

        if (!isNullOrBlank(member.getPassword())) {
            throw new RuntimeException("Password is already set");
        }

        member.setPassword(passwordEncoder.encode(password));
        return modelMapper.MemberEntityToDto(memberRepository.save(member));
    }

    private boolean checkValidEmail(String email) {
        if (email == null || email.isBlank()) {
            return true;
        }
        String emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        return email.matches(emailPattern);
    }

    @Override
    public MemberDto updateSelf(MemberDto memberDto) {
        if (isUsernameOrEmailMissing(memberDto.getUsername(), memberDto.getEmail())) {
            throw new RuntimeException("Username or Email cannot be empty");
        }

        String username = getCurrentUsername();
        Member member = memberRepository.findByEmailOrUsername(username, username).orElseThrow(
                () -> new ResourceNotFoundException("Member not found with username: " + username));

        boolean usernameFlag = !memberRepository.findByUsernameExceptOne(memberDto.getUsername(), member.getMemberId()).isEmpty();
        boolean emailFlag = !memberRepository.findByEmailExceptOne(memberDto.getEmail(), member.getMemberId()).isEmpty();

        if (usernameFlag || emailFlag) {
            if (usernameFlag && emailFlag) {
                throw new RuntimeException("Username and Email already exist");
            }
            throw new RuntimeException(
                    usernameFlag ? "Username already exists" : "Email already exists"
            );
        }

        member.setFirstName(memberDto.getFirstName());
        member.setLastName(memberDto.getLastName());
        member.setEmail(memberDto.getEmail());
        member.setUsername(memberDto.getUsername());
        Member save = memberRepository.save(member);

        return modelMapper.MemberEntityToDto(save);
    }

    private boolean lessThanFourNonSpaceChars(String input) {
        if (input == null) return true;
        String noSpaces = input.replaceAll("\\s", "");
        return noSpaces.length() < 4;
    }

    private boolean isUsernameOrEmailMissing(String username, String email) {
        return isNullOrBlank(username) || isNullOrBlank(email);
    }

    private boolean isNullOrBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

}
