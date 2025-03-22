import { Database } from 'sqlite';
import bcrypt from 'bcrypt';
import { getDatabase } from '../config/database';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export class UserModel {
  private db: Database | null = null;

  private async getDb(): Promise<Database> {
    if (!this.db) {
      this.db = await getDatabase();
    }
    return this.db;
  }

  // 创建用户
  async create(username: string, email: string, password: string): Promise<UserDTO> {
    const db = await this.getDb();
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword]
    );

    const user = await db.get<User>('SELECT * FROM users WHERE id = ?', result.lastID);
    if (!user) {
      throw new Error('Failed to create user');
    }

    return this.toDTO(user);
  }

  // 通过邮箱查找用户
  async findByEmail(email: string): Promise<User | undefined> {
    const db = await this.getDb();
    return db.get<User>('SELECT * FROM users WHERE email = ?', [email]);
  }

  // 通过ID查找用户
  async findById(id: number): Promise<UserDTO | undefined> {
    const db = await this.getDb();
    const user = await db.get<User>('SELECT * FROM users WHERE id = ?', [id]);
    return user ? this.toDTO(user) : undefined;
  }

  // 验证密码
  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  // 更新用户信息
  async update(id: number, data: Partial<User>): Promise<UserDTO | undefined> {
    const db = await this.getDb();
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return;

    values.push(id);
    await db.run(
      `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    const user = await db.get<User>('SELECT * FROM users WHERE id = ?', [id]);
    return user ? this.toDTO(user) : undefined;
  }

  // 转换为DTO
  public toDTO(user: User): UserDTO {
    const { id, username, email, created_at } = user;
    return { id, username, email, created_at };
  }
} 