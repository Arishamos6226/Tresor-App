package ch.bbw.pr.tresorbackend.controller;

import ch.bbw.pr.tresorbackend.model.Secret;
import ch.bbw.pr.tresorbackend.model.NewSecret;
import ch.bbw.pr.tresorbackend.model.EncryptCredentials;
import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.service.SecretService;
import ch.bbw.pr.tresorbackend.service.UserService;
import ch.bbw.pr.tresorbackend.util.EncryptUtil;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * SecretController
 * @author Peter Rutschmann
 */
@RestController
@AllArgsConstructor
@RequestMapping("api/secrets")
public class SecretController {

   private SecretService secretService;
   private UserService userService;

   // ─────────────────────────────────────────────
   // POST /api/secrets  → Secret erstellen
   // ─────────────────────────────────────────────
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PostMapping
   public ResponseEntity<String> createSecret2(
           @Valid @RequestBody NewSecret newSecret,
           BindingResult bindingResult) {

      // Input-Validierung
      if (bindingResult.hasErrors()) {
         List<String> errors = bindingResult.getFieldErrors().stream()
                 .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                 .collect(Collectors.toList());
         JsonArray arr = new JsonArray();
         errors.forEach(arr::add);
         JsonObject obj = new JsonObject();
         obj.add("message", arr);
         return ResponseEntity.badRequest().body(new Gson().toJson(obj));
      }

      // Benutzer suchen
      User user = userService.findByEmail(newSecret.getEmail());
      if (user == null) return ResponseEntity.notFound().build();

      // Salt generieren falls nicht vorhanden
      String salt = user.getSalt();
      if (salt == null || salt.isEmpty()) {
         salt = EncryptUtil.generateSalt();
         user.setSalt(salt);
         userService.updateUser(user);
      }

      System.out.println("createSecret: userId=" + user.getId());
      System.out.println("createSecret: salt=" + salt);

      try {
         EncryptUtil encryptUtil = new EncryptUtil(newSecret.getEncryptPassword(), salt);
         String encryptedContent = encryptUtil.encrypt(newSecret.getContent().toString());

         Secret secret = new Secret(null, user.getId(), encryptedContent);
         secretService.createSecret(secret);

         JsonObject obj = new JsonObject();
         obj.addProperty("answer", "Secret saved");
         return ResponseEntity.accepted().body(new Gson().toJson(obj));

      } catch (Exception e) {
         System.err.println("createSecret: Encryption failed: " + e.getMessage());
         JsonObject obj = new JsonObject();
         obj.addProperty("message", "Encryption failed: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                 .body(new Gson().toJson(obj));
      }
   }

   // ─────────────────────────────────────────────
   // POST /api/secrets/byuserid  → Secrets by UserId lesen
   // ─────────────────────────────────────────────
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PostMapping("/byuserid")
   public ResponseEntity<List<Secret>> getSecretsByUserId(
           @RequestBody EncryptCredentials credentials) {

      User user = userService.getUserById(credentials.getUserId());
      if (user == null) return ResponseEntity.notFound().build();

      List<Secret> secrets = secretService.getSecretsByUserId(credentials.getUserId());
      if (secrets.isEmpty()) return ResponseEntity.notFound().build();

      String salt = user.getSalt();
      if (salt == null || salt.isEmpty()) {
         salt = EncryptUtil.generateSalt();
         user.setSalt(salt);
         userService.updateUser(user);
      }

      System.out.println("getSecretsByUserId: userId=" + credentials.getUserId());
      System.out.println("getSecretsByUserId: salt=" + salt);

      try {
         EncryptUtil encryptUtil = new EncryptUtil(credentials.getEncryptPassword(), salt);
         for (Secret secret : secrets) {
            secret.setContent(encryptUtil.decrypt(secret.getContent()));
         }
         return ResponseEntity.ok(secrets);

      } catch (Exception e) {
         System.err.println("getSecretsByUserId: Decryption failed: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
      }
   }

   // ─────────────────────────────────────────────
   // POST /api/secrets/byemail  → Secrets by Email lesen
   // ─────────────────────────────────────────────
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PostMapping("/byemail")
   public ResponseEntity<List<Secret>> getSecretsByEmail(
           @RequestBody EncryptCredentials credentials) {

      User user = userService.findByEmail(credentials.getEmail());
      if (user == null) return ResponseEntity.notFound().build();

      List<Secret> secrets = secretService.getSecretsByUserId(user.getId());
      if (secrets.isEmpty()) return ResponseEntity.notFound().build();

      String salt = user.getSalt();
      if (salt == null || salt.isEmpty()) {
         salt = EncryptUtil.generateSalt();
         user.setSalt(salt);
         userService.updateUser(user);
      }

      System.out.println("getSecretsByEmail: email=" + credentials.getEmail());
      System.out.println("getSecretsByEmail: salt=" + salt);

      try {
         EncryptUtil encryptUtil = new EncryptUtil(credentials.getEncryptPassword(), salt);
         for (Secret secret : secrets) {
            secret.setContent(encryptUtil.decrypt(secret.getContent()));
         }
         return ResponseEntity.ok(secrets);

      } catch (Exception e) {
         System.err.println("getSecretsByEmail: Decryption failed: " + e.getMessage());
         JsonObject obj = new JsonObject();
         obj.addProperty("message", "Decryption failed: " + e.getMessage());
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
      }
   }

   // ─────────────────────────────────────────────
   // GET /api/secrets  → Alle Secrets (Admin)
   // ─────────────────────────────────────────────
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @GetMapping
   public ResponseEntity<List<Secret>> getAllSecrets() {
      List<Secret> secrets = secretService.getAllSecrets();
      return new ResponseEntity<>(secrets, HttpStatus.OK);
   }

   // ─────────────────────────────────────────────
   // PUT /api/secrets/{id}  → Secret aktualisieren
   // ─────────────────────────────────────────────
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @PutMapping("/{id}")
   public ResponseEntity<String> updateSecret(
           @PathVariable("id") Long secretId,
           @Valid @RequestBody NewSecret newSecret,
           BindingResult bindingResult) {

      if (bindingResult.hasErrors()) {
         List<String> errors = bindingResult.getFieldErrors().stream()
                 .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                 .collect(Collectors.toList());

         JsonArray arr = new JsonArray();
         errors.forEach(arr::add);

         JsonObject obj = new JsonObject();
         obj.add("message", arr);
         return ResponseEntity.badRequest().body(new Gson().toJson(obj));
      }

      Secret dbSecret = secretService.getSecretById(secretId);
      if (dbSecret == null) {
         JsonObject obj = new JsonObject();
         obj.addProperty("answer", "Secret not found");
         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Gson().toJson(obj));
      }

      User user = userService.findByEmail(newSecret.getEmail());
      if (user == null) {
         return ResponseEntity.notFound().build();
      }

      if (!dbSecret.getUserId().equals(user.getId())) {
         JsonObject obj = new JsonObject();
         obj.addProperty("answer", "Secret does not belong to this user");
         return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new Gson().toJson(obj));
      }

      try {
         EncryptUtil encryptUtil = new EncryptUtil(newSecret.getEncryptPassword(), user.getSalt());

         // Passwort prüfen
         encryptUtil.decrypt(dbSecret.getContent());

         // Neue Daten verschlüsseln
         String encryptedContent = encryptUtil.encrypt(newSecret.getContent().toString());

         Secret updatedSecret = new Secret(secretId, user.getId(), encryptedContent);
         Secret saved = secretService.updateSecret(updatedSecret);

         if (saved == null) {
            JsonObject obj = new JsonObject();
            obj.addProperty("answer", "Secret could not be updated");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Gson().toJson(obj));
         }

         JsonObject obj = new JsonObject();
         obj.addProperty("answer", "Secret updated");
         return ResponseEntity.ok(new Gson().toJson(obj));

      } catch (Exception e) {
         JsonObject obj = new JsonObject();
         obj.addProperty("answer", "Password not correct or decryption failed.");
         return ResponseEntity.badRequest().body(new Gson().toJson(obj));
      }
   }

   // ─────────────────────────────────────────────
   // DELETE /api/secrets/{id}  → Secret löschen
   // ─────────────────────────────────────────────
   @CrossOrigin(origins = "${CROSS_ORIGIN}")
   @DeleteMapping("/{id}")
   public ResponseEntity<String> deleteSecret(@PathVariable Long id) {
      Secret dbSecret = secretService.getSecretById(id);
      if (dbSecret == null) {
         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Secret not found");
      }

      try {
         secretService.deleteSecret(id);
         return ResponseEntity.ok("Secret deleted successfully");
      } catch (Exception e) {
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete failed");
      }
   }
}