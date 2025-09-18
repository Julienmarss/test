package com.legipilot.service.shared.infra;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncriptionUtils {

    private static final String ALGORITHM = "AES";
    private static final String CIPHER_ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final byte[] IV = new byte[12];
    private static final SecretKey SECRET_KEY = getKey();


    private static SecretKey getKey() {
        // Clé encodée en Base64
        String encodedKey = "bliBxg1A+rXB+FDu3L38j5LMG/8z/YH7AIgkwapRxP4=";

        // Décoder la clé Base64 en tableau de bytes
        byte[] decodedKey = Base64.getDecoder().decode(encodedKey);

        // Créer la SecretKey à partir du tableau de bytes
        return new SecretKeySpec(decodedKey, 0, decodedKey.length, ALGORITHM);
    }

    public static String encrypt(String data) {
        if (data == null) return null;
        try {
            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, SECRET_KEY, new GCMParameterSpec(GCM_TAG_LENGTH, IV));
            byte[] encryptedData = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encryptedData);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du chiffrement", e);
        }
    }

    public static String decrypt(String encryptedData) {
        if (encryptedData == null) return null;
        try {
            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, SECRET_KEY, new GCMParameterSpec(GCM_TAG_LENGTH, IV));
            byte[] decodedData = Base64.getDecoder().decode(encryptedData);
            return new String(cipher.doFinal(decodedData));
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du déchiffrement", e);
        }
    }
}
