package ch.bbw.pr.tresorbackend.controller;

import ch.bbw.pr.tresorbackend.service.PasswordResetService;
import com.google.gson.JsonObject;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/password-reset")
@AllArgsConstructor
public class PasswordResetController {
    private final PasswordResetService passwordResetService;

    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @PostMapping("/request")
    public ResponseEntity<String> requestReset(@RequestBody JsonObject body) {
        String email = body.get("email").getAsString();
        passwordResetService.createResetToken(email);
        return ResponseEntity.ok("Falls diese Email existiert, wurde ein Reset-Link gesendet.");
    }

    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @GetMapping("/validate")
    public ResponseEntity<JsonObject> validateToken(@RequestParam String token) {
        boolean valid = passwordResetService.isTokenValid(token);
        JsonObject response = new JsonObject();
        response.addProperty("valid", valid);
        if (!valid) {
            response.addProperty("message", "Token ist ungültig oder abgelaufen.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @CrossOrigin(origins = "${CROSS_ORIGIN}")
    @PostMapping("/confirm")
    public ResponseEntity<JsonObject> confirmReset(@RequestBody JsonObject body) {
        String token = body.get("token").getAsString();
        String newPassword = body.get("newPassword").getAsString();
        String confirmPassword = body.get("confirmPassword").getAsString();

        if (!newPassword.equals(confirmPassword) || newPassword.length() < 8 || !newPassword.matches(".*[A-Z].*") || !newPassword.matches(".*\\d.*")) {
            JsonObject response = new JsonObject();
            response.addProperty("message", "Passwort ungültig oder stimmt nicht überein.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        boolean success = passwordResetService.resetPassword(token, newPassword);
        JsonObject response = new JsonObject();
        if (success) {
            response.addProperty("message", "Passwort erfolgreich zurückgesetzt.");
            return ResponseEntity.ok(response);
        } else {
            response.addProperty("message", "Token ist ungültig oder abgelaufen.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}