import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialRbacData1711175100000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建基础权限
        const permissions = [
            // 用户管理权限
            ['system:user:view', '查看用户', 'user', 'view'],
            ['system:user:create', '创建用户', 'user', 'create'],
            ['system:user:edit', '编辑用户', 'user', 'edit'],
            ['system:user:delete', '删除用户', 'user', 'delete'],
            
            // 角色管理权限
            ['system:role:view', '查看角色', 'role', 'view'],
            ['system:role:create', '创建角色', 'role', 'create'],
            ['system:role:edit', '编辑角色', 'role', 'edit'],
            ['system:role:delete', '删除角色', 'role', 'delete'],
            
            // 权限管理权限
            ['system:permission:view', '查看权限', 'permission', 'view'],
            ['system:permission:create', '创建权限', 'permission', 'create'],
            ['system:permission:edit', '编辑权限', 'permission', 'edit'],
            ['system:permission:delete', '删除权限', 'permission', 'delete'],
            
            // 任务管理权限
            ['system:task:view', '查看任务', 'task', 'view'],
            ['system:task:create', '创建任务', 'task', 'create'],
            ['system:task:edit', '编辑任务', 'task', 'edit'],
            ['system:task:delete', '删除任务', 'task', 'delete'],
            ['system:task:assign', '分配任务', 'task', 'assign']
        ];

        // 插入权限数据
        for (const [name, description, resource, action] of permissions) {
            await queryRunner.query(
                `INSERT INTO permissions (name, description, resource, action) VALUES (?, ?, ?, ?)`,
                [name, description, resource, action]
            );
        }

        // 创建基础角色
        const roles = [
            ['admin', '系统管理员'],
            ['teacher', '教师'],
            ['student', '学生']
        ];

        // 插入角色数据
        for (const [name, description] of roles) {
            await queryRunner.query(
                `INSERT INTO roles (name, description) VALUES (?, ?)`,
                [name, description]
            );
        }

        // 为管理员角色分配所有权限
        const adminRoleId = await queryRunner.query(
            `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`
        );
        const allPermissionIds = await queryRunner.query(
            `SELECT id FROM permissions`
        );

        for (const { id } of allPermissionIds) {
            await queryRunner.query(
                `INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
                [adminRoleId[0].id, id]
            );
        }

        // 为教师角色分配任务相关权限
        const teacherRoleId = await queryRunner.query(
            `SELECT id FROM roles WHERE name = 'teacher' LIMIT 1`
        );
        const teacherPermissions = await queryRunner.query(
            `SELECT id FROM permissions WHERE resource = 'task'`
        );

        for (const { id } of teacherPermissions) {
            await queryRunner.query(
                `INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
                [teacherRoleId[0].id, id]
            );
        }

        // 为学生角色分配查看任务权限
        const studentRoleId = await queryRunner.query(
            `SELECT id FROM roles WHERE name = 'student' LIMIT 1`
        );
        const studentPermissions = await queryRunner.query(
            `SELECT id FROM permissions WHERE name IN ('system:task:view')`
        );

        for (const { id } of studentPermissions) {
            await queryRunner.query(
                `INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
                [studentRoleId[0].id, id]
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 清空角色权限关联
        await queryRunner.query(`DELETE FROM role_permissions`);
        
        // 清空角色
        await queryRunner.query(`DELETE FROM roles`);
        
        // 清空权限
        await queryRunner.query(`DELETE FROM permissions`);
    }
} 