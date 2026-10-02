package com.project.lms.backend.controller;

import com.project.lms.backend.dto.*;
import com.project.lms.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${cors.allowedOrigin}")
    private String allowedOrigin;

    @PostMapping("/register")
    public ResponseEntity<String> registerNaw(@RequestBody MemberDto memberDto) {
        return new ResponseEntity<>(authService.registerNaw(memberDto), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtDto> login(@RequestBody LoginDto loginDto) {
        return ResponseEntity.ok(authService.login(loginDto));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @GetMapping("/get-member-details")
    public ResponseEntity<MemberDto> getMemberDetails() {
        return ResponseEntity.ok(authService.getMemberDetails());
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @GetMapping("/get-member-details/{memberId}")
    public ResponseEntity<MemberDto> getOtherMemberDetails(@PathVariable Long memberId) {
        return ResponseEntity.ok(authService.getOtherMemberDetails(memberId));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PostMapping("/members")
    public ResponseEntity<List<MemberDto>> getAllMembers(@RequestBody FilterMemberDto filterMemberDto) {
        return ResponseEntity.ok(authService.getAllMembers(filterMemberDto));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PostMapping("/validate-password")
    public ResponseEntity<Boolean> validatePassword(@RequestBody Map<String, String> body) {
        String password = body.get("password");
        return ResponseEntity.ok(authService.validatePassword(password));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PutMapping("/update-self")
    public ResponseEntity<MemberDto> updateSelf(@RequestBody MemberDto memberDto) {
        return ResponseEntity.ok(authService.updateSelf(memberDto));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @DeleteMapping("/delete-self")
    public ResponseEntity<String> deleteSelf() {
        authService.deleteSelf();
        return new ResponseEntity<>("Account successfully deleted", HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PutMapping("/pass-change")
    public ResponseEntity<String> passwordChange(@RequestBody PasswordChangeDto passwordChangeDto) {
        authService.passwordChange(passwordChangeDto);
        return ResponseEntity.ok("Password successfully changed");
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PutMapping("/pic-update")
    public ResponseEntity<String> updateProfilePic(@RequestPart("memberImg") MultipartFile memberImg) {
        authService.updateProfilePic(memberImg);
        return new ResponseEntity<>("Profile picture successfully updated", HttpStatus.OK);

    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PutMapping("/delete-pic")
    public ResponseEntity<String> deleteProfilePic() {
        authService.deleteProfilePic();
        return ResponseEntity.ok("Profile picture successfully deleted");
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PatchMapping("/update-username")
    public ResponseEntity<MemberDto> updateUserNameSelf(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        return ResponseEntity.ok(authService.updateUserNameSelf(username));
    }

    @PreAuthorize("hasAnyRole('ROLE_MEMBER', 'ROLE_LIBRARIAN')")
    @PatchMapping("/set-password")
    public ResponseEntity<MemberDto> setPasswordSelf(@RequestBody Map<String, String> body) {
        String password = body.get("password");
        return ResponseEntity.ok(authService.setPasswordSelf(password));
    }

    @PreAuthorize("hasRole('ROLE_LIBRARIAN')")
    @PatchMapping("/update-status")
    public ResponseEntity<String> updateOtherStatus(@RequestBody MemberDto memberDto) {
        return ResponseEntity.ok("Updated status: " + authService.updateOtherStatus(memberDto).name());
    }

    @GetMapping("/oauth2-success")
    public String oauth2Success(@RequestParam(value = "token", required = false) String token,
                                @RequestParam(value = "expiration", required = false) String expiration) {

        return """
                <html>
                <body style="background: #f4f4f4; display: flex; align-items: center; justify-content: center;">
                    <div style="font-family: sans-serif; text-align: center;">
                        <h2>Authenticating...</h2>
                        <p>Please wait while we redirect you.</p>
                    </div>
                    <script>
                        const authData = {
                            type: 'AUTH_SUCCESS',
                            token: '%s',
                            expiration: '%s'
                        };
                        window.opener.postMessage(authData, '%s');
                        // Give the browser 200ms to dispatch the event before killing the window
                        setTimeout(() => {
                           window.close();
                        }, 300);
                    </script>
                </body>
                </html>
                """.formatted(token, expiration, allowedOrigin);
    }
}
