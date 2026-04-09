package ch.bbw.pr.tresorbackend.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * PasswordEncryptService
 *   used to hash password and verify match
 * @author Peter Rutschmann
 */
@Service
public class PasswordEncryptService {
   //todo add implementation here
   private static final String PEPPER = "mySecretPepper"; // In production, store this securely and do not hardcode

   private final BCryptPasswordEncoder passwordEncoder;

   public PasswordEncryptService(BCryptPasswordEncoder passwordEncoder) {
      //todo add implementation here
      this.passwordEncoder = passwordEncoder;
   }

   public String hashPassword(String password) {
      password = passwordEncoder.encode(password + PEPPER);
      //todo add implementation here
      System.out.println(password);
      return password;
   }

   //Todo add password match function: password vs hashedPassword
    public boolean verifyPassword(String password, String hashedPassword) {
        //todo add implementation here
       String rawPasswordWithPepper = password + PEPPER;
        return passwordEncoder.matches(hashedPassword, rawPasswordWithPepper);
    }
}