import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';

// Key length for derived hash
const KEY_LENGTH = 32;

/**
 * Hash a password using scrypt.
 * @param password - The plaintext password to hash.
 * @returns A promise resolving to the hashed password in the format: salt.hash
 */
export async function hash(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password cannot be empty.");
  }

  const salt: string = randomBytes(16).toString('hex'); // Generate a random salt
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) {
        reject(new Error(`Failed to hash password: ${err.message}`));
        return;
      }

      resolve(`${salt}.${(derivedKey as Buffer).toString('hex')}`);
    });
  });
}

/**
 * Compare a plaintext password against a stored hash.
 * @param password - The plaintext password to verify.
 * @param storedHash - The stored hash in the format: salt.hash
 * @returns A promise resolving to true if the password matches, false otherwise.
 */
export async function compare(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) {
    throw new Error("Password and stored hash must be provided.");
  }

  const [salt, hash] = storedHash.split('.');
  if (!salt || !hash) {
    throw new Error("Stored hash format is invalid. Expected format: salt.hash");
  }

  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) {
        reject(new Error(`Failed to compare password: ${err.message}`));
        return;
      }

      try {
        const hashBuffer: Buffer = Buffer.from(hash, 'hex');
        const derivedKeyBuffer: Buffer = derivedKey as Buffer;

        // Use timingSafeEqual to safely compare hashes
        resolve(timingSafeEqual(derivedKeyBuffer, hashBuffer));
      } catch (error) {
        reject(new Error(`Error during hash comparison: ${(error as Error).message}`));
      }
    });
  });
}
