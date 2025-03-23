import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { PasswordUtils } from '../utils/password';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';

const userRepository = AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  static async register(username: string, email: string, password: string) {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;

    await userRepository.save(user);

    const token = this.generateToken(user);
    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  static async getCurrentUser(userId: number) {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return user;
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }

  private static generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
} 