package ch.bbw.pr.tresorbackend.service;

import ch.bbw.pr.tresorbackend.model.PasswordResetToken;
import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.repository.PasswordResetTokenRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PasswordResetService {
    private final PasswordResetTokenRepository tokenRepository;
    private final UserService userService;
    private final PasswordEncryptService passwordEncryptService;

    @Transactional
    public String createResetToken(String email) {
        User user = userService.findByEmail(email);
        if (user == null) {
            return null;
        }

        tokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(1);

        PasswordResetToken resetToken = new PasswordResetToken(null, user.getId(), token, expiryDate);
        tokenRepository.save(resetToken);

        System.out.println("=== PASSWORD RESET LINK ===");
        System.out.println("http://localhost:3000/reset-password?token=" + token);
        System.out.println("===========================");

        return token;
    }

    public boolean isTokenValid(String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> t.getExpiryDate().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);
        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            if (resetToken != null) {
                tokenRepository.delete(resetToken);
            }
            return false;
        }

        User user = userService.getUserById(resetToken.getUserId());
        user.setPassword(passwordEncryptService.hashPassword(newPassword));
        userService.updatePassword(user);

        tokenRepository.delete(resetToken);
        return true;
    }
}