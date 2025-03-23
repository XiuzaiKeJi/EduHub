import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Permission } from './Permission';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    name: string;

    @Column({ length: 200, nullable: true })
    description: string;

    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'role_permissions',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
    })
    permissions: Permission[];

    @ManyToMany(() => User, user => user.roles)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 