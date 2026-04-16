package ch.bbw.pr.tresorbackend.service;

import io.github.cdimascio.dotenv.Dotenv;
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
   private final String pepper; // In production, store this securely and do not hardcode

   private final BCryptPasswordEncoder passwordEncoder;

   public PasswordEncryptService() {
      //todo add implementation here
      Dotenv dotenv = Dotenv.configure().directory("./Backend").load();
      this.pepper = dotenv.get("PEPPER"); // Load pepper from environment variable
      if (this.pepper == null || this.pepper.isEmpty()) {
         throw new IllegalStateException("PEPPER ist nicht in der .env-Datei gesetzt!");
      }

      String costFactorStr = dotenv.get("BCRYPT_COST");
      int costFactor = 12; // Standardwert
      if (costFactorStr != null && !costFactorStr.isEmpty()) {
         try {
            costFactor = Integer.parseInt(costFactorStr);
         } catch (NumberFormatException e) {
            throw new IllegalStateException("BCRYPT_COST ist keine gültige Zahl!");
         }
      }

      this.passwordEncoder = new BCryptPasswordEncoder(costFactor);
   }

   public String hashPassword(String password) {
      password = passwordEncoder.encode(password + pepper);
      //todo add implementation here
      System.out.println(password);
      return password;
   }

   //Todo add password match function: password vs hashedPassword
    public boolean verifyPassword(String password, String hashedPassword) {
        //todo add implementation here
       String rawPasswordWithPepper = password + pepper;
        return passwordEncoder.matches(hashedPassword, rawPasswordWithPepper);
    }
}