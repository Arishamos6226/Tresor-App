package ch.bbw.pr.tresorbackend.controller;

import ch.bbw.pr.tresorbackend.service.PasswordResetService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// PasswordResetController.java
@RestController
@RequestMapping("api/password-reset")
@AllArgsConstructor
public class PasswordResetController {
    private final PasswordResetService passwordResetService;

    // Kleines DTO direkt in der Klasse – kein extra File nötig
    record ResetRequest(String email) {}
    record ConfirmRequest(String token, String newPassword, String confirmPassword) {}

    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @PostMapping("/request")
    public ResponseEntity<String> requestReset(@RequestBody ResetRequest body) {
        passwordResetService.createResetToken(body.email());
        return ResponseEntity.ok("Falls diese Email existiert, wurde ein Reset-Link gesendet.");
    }

    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestParam String token) {
        boolean valid = passwordResetService.isTokenValid(token);
        if (!valid) {
            return ResponseEntity.badRequest().body("Token ist ungültig oder abgelaufen.");
        }
        return ResponseEntity.ok("Token ist gültig.");
    }

    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @PostMapping("/confirm")
    public ResponseEntity<String> confirmReset(@RequestBody ConfirmRequest body) {
        if (!body.newPassword().equals(body.confirmPassword())
                || body.newPassword().length() < 8
                || !body.newPassword().matches(".*[A-Z].*")
                || !body.newPassword().matches(".*\\d.*")) {
            return ResponseEntity.badRequest()
                    .body("Passwort ungültig oder stimmt nicht überein.");
        }

        boolean success = passwordResetService.resetPassword(body.token(), body.newPassword());
        if (success) {
            return ResponseEntity.ok("Passwort erfolgreich zurückgesetzt.");
        }
        return ResponseEntity.badRequest().body("Token ist ungültig oder abgelaufen.");
    }
}