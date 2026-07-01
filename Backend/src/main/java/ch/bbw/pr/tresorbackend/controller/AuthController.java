package ch.bbw.pr.tresorbackend.controller;

import ch.bbw.pr.tresorbackend.config.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    @GetMapping("/token")
    public ResponseEntity<?> getJwtToken(Authentication authentication) {
        String email = authentication.getName(); // stammt aus Basic Auth
        String jwt = JwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", jwt));
    }
}