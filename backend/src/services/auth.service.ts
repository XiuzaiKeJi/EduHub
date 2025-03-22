import jwt from 'jsonwebtoken';
import { UserModel, User, UserDTO } from '../models/user';

export class AuthService {
  private userModel: UserModel;
  private jwtSecret: string;

  constructor() {
    this.userModel = new UserModel();
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  // 用户注册
  async register(username: string, email: string, password: string): Promise<UserDTO> {
    // 检查邮箱是否已存在
    const existingUser = await this.userModel.findByEmail(email);
    if (existingUser) {
      throw new Error('邮箱已被注册');
    }

    // 创建新用户
    return this.userModel.create(username, email, password);
  }

  // 用户登录
  async login(email: string, password: string): Promise<{ user: UserDTO; token: string }> {
    // 查找用户
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const isValid = await this.userModel.verifyPassword(user, password);
    if (!isValid) {
      throw new Error('密码错误');
    }

    // 生成JWT令牌
    const token = this.generateToken(user);

    return {
      user: this.userModel.toDTO(user),
      token,
    };
  }

  // 获取当前用户信息
  async getCurrentUser(userId: number): Promise<UserDTO> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  }

  // 验证令牌
  verifyToken(token: string): { userId: number } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: number };
      return decoded;
    } catch (error) {
      throw new Error('无效的令牌');
    }
  }

  // 生成JWT令牌
  private generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id },
      this.jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }
} 