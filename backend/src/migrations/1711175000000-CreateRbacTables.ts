import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRbacTables1711175000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 创建权限表
        await queryRunner.createTable(
            new Table({
                name: 'permissions',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '50',
                        isUnique: true
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '200',
                        isNullable: true
                    },
                    {
                        name: 'resource',
                        type: 'varchar',
                        length: '50'
                    },
                    {
                        name: 'action',
                        type: 'varchar',
                        length: '20'
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP'
                    }
                ]
            }),
            true
        );

        // 创建角色表
        await queryRunner.createTable(
            new Table({
                name: 'roles',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '50',
                        isUnique: true
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '200',
                        isNullable: true
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP'
                    }
                ]
            }),
            true
        );

        // 创建角色权限关联表
        await queryRunner.createTable(
            new Table({
                name: 'role_permissions',
                columns: [
                    {
                        name: 'role_id',
                        type: 'int'
                    },
                    {
                        name: 'permission_id',
                        type: 'int'
                    }
                ]
            }),
            true
        );

        // 创建用户角色关联表
        await queryRunner.createTable(
            new Table({
                name: 'user_roles',
                columns: [
                    {
                        name: 'user_id',
                        type: 'int'
                    },
                    {
                        name: 'role_id',
                        type: 'int'
                    }
                ]
            }),
            true
        );

        // 添加外键约束
        await queryRunner.createForeignKey(
            'role_permissions',
            new TableForeignKey({
                columnNames: ['role_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'roles',
                onDelete: 'CASCADE'
            })
        );

        await queryRunner.createForeignKey(
            'role_permissions',
            new TableForeignKey({
                columnNames: ['permission_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'permissions',
                onDelete: 'CASCADE'
            })
        );

        await queryRunner.createForeignKey(
            'user_roles',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE'
            })
        );

        await queryRunner.createForeignKey(
            'user_roles',
            new TableForeignKey({
                columnNames: ['role_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'roles',
                onDelete: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 删除外键约束
        const userRoles = await queryRunner.getTable('user_roles');
        const rolePermissions = await queryRunner.getTable('role_permissions');
        
        if (userRoles) {
            const userRolesForeignKeys = userRoles.foreignKeys;
            for (const foreignKey of userRolesForeignKeys) {
                await queryRunner.dropForeignKey('user_roles', foreignKey);
            }
        }
        
        if (rolePermissions) {
            const rolePermissionsForeignKeys = rolePermissions.foreignKeys;
            for (const foreignKey of rolePermissionsForeignKeys) {
                await queryRunner.dropForeignKey('role_permissions', foreignKey);
            }
        }

        // 删除表
        await queryRunner.dropTable('user_roles');
        await queryRunner.dropTable('role_permissions');
        await queryRunner.dropTable('roles');
        await queryRunner.dropTable('permissions');
    }
} 