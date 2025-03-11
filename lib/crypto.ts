//@ts-expect-error - Using crypto-browserify for cross-platform compatibility
import crypto, { BinaryLike, CipherKey } from "crypto-browserify";
// For simplicity, we'll use PBKDF2. You might use argon2 library or bcrypt instead.
const PBKDF2_ITERATIONS = 100000;
const KEY_LENGTH = 32; // 256 bits
const ALGORITHM = "aes-256-gcm";

// Generate random salt
export function generateSalt(length = 16): string {
  return crypto.randomBytes(length).toString("hex"); // hex string
}

// Generate a random Recovery Key (32 bytes -> 64 hex chars)
export function generateRecoveryKey(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

// Generate hash
export function generateHash(key: Buffer): string {
  return crypto.createHash("sha256").update(new Uint8Array(key)).digest("hex");
}

/**
 * Derive a 256-bit key from password + salt using PBKDF2.
 * @param password - user-provided master password
 * @param salt - hex string
 * @returns Buffer of derived key
 */
export async function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, "sha256", (err: any, derivedKey: any) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

/**
 * Encrypt plaintext using AES-256-GCM.
 * Returns an object with { iv, authTag, ciphertext } in hex form.
 */
export function encryptAES(
  key: Buffer,
  plaintext: Buffer
): {
  iv: string;
  authTag: string;
  ciphertext: string;
} {
  const iv = crypto.randomBytes(12); // 96-bit IV for AES-GCM
  const cipher = crypto.createCipheriv(ALGORITHM, new Uint8Array(key), new Uint8Array(iv));

  const ciphertext = Buffer.concat([
    new Uint8Array(cipher.update(new Uint8Array(plaintext))),
    new Uint8Array(cipher.final()),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    ciphertext: ciphertext.toString("hex"),
  };
}

/**
 * Decrypt using AES-256-GCM.
 * Expects an object with { iv, authTag, ciphertext } in hex form.
 */
export function decryptAES(
  key: CipherKey,
  encrypted: {
    iv: string;
    authTag: string;
    ciphertext: string;
  }
): Buffer {
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(encrypted.iv, "hex") as BinaryLike);
  decipher.setAuthTag(new Uint8Array(Buffer.from(encrypted.authTag, "hex")));

  const plaintext = Buffer.concat([
    new Uint8Array(decipher.update(new Uint8Array(Buffer.from(encrypted.ciphertext, "hex")))),
    new Uint8Array(decipher.final()),
  ]);
  return plaintext;
}
