import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable } from 'typeorm';
import { Task } from './Task';
import { PasswordUtils } from '../utils/password';
import { Role } from './Role';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];

  @ManyToMany(() => Role, role => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles: Role[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await PasswordUtils.hash(this.password);
    }
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await PasswordUtils.verify(password, this.password);
  }
} 