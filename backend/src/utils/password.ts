import crypto from 'crypto';

export class PasswordUtils {
  private static readonly SALT_LENGTH = 16;
  private static readonly KEY_LENGTH = 64;
  private static readonly ITERATIONS = 10000;
  private static readonly DIGEST = 'sha512';

  static async hash(password: string): Promise<string> {
    const salt = crypto.randomBytes(this.SALT_LENGTH).toString('hex');
    const hash = await this.hashWithSalt(password, salt);
    return `${salt}:${hash}`;
  }

  static async verify(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, hash] = hashedPassword.split(':');
    const newHash = await this.hashWithSalt(password, salt);
    return hash === newHash;
  }

  private static hashWithSalt(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        this.ITERATIONS,
        this.KEY_LENGTH,
        this.DIGEST,
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey.toString('hex'));
        }
      );
    });
  }
} 