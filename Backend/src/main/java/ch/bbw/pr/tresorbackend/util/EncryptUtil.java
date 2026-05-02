package ch.bbw.pr.tresorbackend.util;

import javax.crypto.*;
import javax.crypto.spec.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.KeySpec;
import java.util.Base64;

public class EncryptUtil {

    private static final String ALGORITHM        = "AES";
    private static final String TRANSFORMATION   = "AES/GCM/NoPadding";
    private static final int    IV_SIZE          = 12;
    private static final int    TAG_LENGTH       = 128;
    private static final int    PBKDF2_ITERATIONS = 65536;
    private static final int    KEY_SIZE_BITS    = 256;

    private final SecretKey secretKey;

    /**
     * Leitet einen sicheren AES-256-Schlüssel aus Passwort + Salt ab (PBKDF2).
     */
    public EncryptUtil(String password, String saltBase64) throws Exception {
        byte[] salt = Base64.getDecoder().decode(saltBase64);
        KeySpec spec = new PBEKeySpec(
                password.toCharArray(),
                salt,
                PBKDF2_ITERATIONS,
                KEY_SIZE_BITS
        );
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        byte[] keyBytes = factory.generateSecret(spec).getEncoded();
        this.secretKey = new SecretKeySpec(keyBytes, ALGORITHM);
    }

    public String encrypt(String plainText) throws Exception {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        byte[] iv = new byte[IV_SIZE];
        new SecureRandom().nextBytes(iv);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(TAG_LENGTH, iv));
        byte[] encrypted = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

        // IV + verschlüsselter Text zusammen speichern
        byte[] combined = new byte[IV_SIZE + encrypted.length];
        System.arraycopy(iv,        0, combined, 0,       IV_SIZE);
        System.arraycopy(encrypted, 0, combined, IV_SIZE, encrypted.length);
        return Base64.getEncoder().encodeToString(combined);
    }

    public String decrypt(String base64Data) throws Exception {
        byte[] combined = Base64.getDecoder().decode(base64Data);

        byte[] iv        = new byte[IV_SIZE];
        byte[] encrypted = new byte[combined.length - IV_SIZE];
        System.arraycopy(combined, 0,       iv,        0, IV_SIZE);
        System.arraycopy(combined, IV_SIZE, encrypted, 0, encrypted.length);

        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(TAG_LENGTH, iv));
        byte[] decrypted = cipher.doFinal(encrypted);
        return new String(decrypted, StandardCharsets.UTF_8);
    }

    /** Generiert einen neuen zufälligen Salt (Base64-kodiert) */
    public static String generateSalt() {
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }
}