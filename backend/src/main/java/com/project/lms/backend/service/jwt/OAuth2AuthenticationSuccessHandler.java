package com.project.lms.backend.service.jwt;

import com.project.lms.backend.entity.Member;
import com.project.lms.backend.entity.Role;
import com.project.lms.backend.exception.ResourceNotFoundException;
import com.project.lms.backend.repository.MemberRepository;
import com.project.lms.backend.repository.RoleRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final MemberRepository memberRepository;
    private final RoleRepository roleRepository;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${server.url}")
    private String serverUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

        // 2. Use Standard Claims (These are unified across OIDC providers)
        String email = oidcUser.getEmail();
        String firstName = oidcUser.getGivenName();
        String lastName = oidcUser.getFamilyName();
        String picture = oidcUser.getPicture();
        String providerId = oidcUser.getSubject();

        // 3. Get the Provider Type from the Token
        OAuth2AuthenticationToken authSnapshot = (OAuth2AuthenticationToken) authentication;
        String registrationId = authSnapshot.getAuthorizedClientRegistrationId().toUpperCase();

        Member member = memberRepository.findByEmail(email).orElseGet(() -> {
            Member newMember = new Member();
            newMember.setEmail(email);
            newMember.setFirstName(firstName);
            newMember.setLastName(lastName);
            newMember.setMemberImg(picture);
            newMember.setProviderCode(providerId);
            newMember.setPassword(null);

            // Convert the registrationId string to your Enum
            // Logic: registrationId will be "GOOGLE" or "MICROSOFT" (if configured as such in yml)
            newMember.setProvider(Member.AuthProvider.valueOf(registrationId));

            Role role = roleRepository.findByName(Role.ERole.ROLE_MEMBER)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            newMember.setRoles(Set.of(role));

            return memberRepository.save(newMember);
        });

        String token = jwtService.generateToken(member.getEmail());
        String targetUrl = serverUrl + "/api/auth/oauth2-success?token=" + token + "&expiration=" + (System.currentTimeMillis() + expiration - 10000);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
