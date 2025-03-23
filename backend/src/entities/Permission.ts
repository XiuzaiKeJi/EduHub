import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Role } from './Role';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    name: string;

    @Column({ length: 200, nullable: true })
    description: string;

    @Column({ length: 50 })
    resource: string;

    @Column({ length: 20 })
    action: string;

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 