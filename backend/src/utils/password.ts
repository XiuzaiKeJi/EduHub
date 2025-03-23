import crypto from 'crypto';
import logger from './logger';

export class PasswordUtils {
  private static readonly SALT_LENGTH = 16;
  private static readonly KEY_LENGTH = 64;
  private static readonly ITERATIONS = 10000;
  private static readonly DIGEST = 'sha512';

  static async hash(password: string): Promise<string> {
    try {
      const salt = crypto.randomBytes(this.SALT_LENGTH).toString('hex');
      const hash = await this.hashWithSalt(password, salt);
      return `${salt}:${hash}`;
    } catch (error) {
      logger.error('密码哈希失败:', error);
      throw error;
    }
  }

  static async verify(password: string, hashedPassword: string): Promise<boolean> {
    try {
      if (!hashedPassword || !hashedPassword.includes(':')) {
        logger.error('无效的哈希密码格式');
        return false;
      }

      const [salt, hash] = hashedPassword.split(':');
      const newHash = await this.hashWithSalt(password, salt);
      return hash === newHash;
    } catch (error) {
      logger.error('密码验证失败:', error);
      return false;
    }
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
          if (err) {
            logger.error('密码哈希计算失败:', err);
            reject(err);
          } else {
            resolve(derivedKey.toString('hex'));
          }
        }
      );
    });
  }
} 