import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaskEntity1708588800000 implements MigrationInterface {
    name = 'UpdateTaskEntity1708588800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 添加枚举类型
        await queryRunner.query(`
            CREATE TYPE "public"."task_status_enum" AS ENUM ('pending', 'in_progress', 'completed', 'cancelled')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."task_priority_enum" AS ENUM ('low', 'medium', 'high')
        `);

        // 更新任务表
        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ALTER COLUMN "status" TYPE "public"."task_status_enum" 
            USING status::text::"public"."task_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD COLUMN "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'medium'
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD COLUMN "dueDate" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD COLUMN "completedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD COLUMN "isArchived" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 删除新增的列
        await queryRunner.query(`
            ALTER TABLE "tasks" 
            DROP COLUMN "isArchived"
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks" 
            DROP COLUMN "completedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks" 
            DROP COLUMN "dueDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "tasks" 
            DROP COLUMN "priority"
        `);

        // 恢复状态列类型
        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ALTER COLUMN "status" TYPE text
        `);

        // 删除枚举类型
        await queryRunner.query(`
            DROP TYPE "public"."task_priority_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."task_status_enum"
        `);
    }
} 