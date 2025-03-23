import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Task } from '../entities/Task';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { CreateUserTable1711174900000 } from '../migrations/1711174900000-CreateUserTable';
import { CreateRbacTables1711175000000 } from '../migrations/1711175000000-CreateRbacTables';
import { InitialRbacData1711175100000 } from '../migrations/1711175100000-InitialRbacData';
import logger from '../utils/logger';

// 获取数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'eduhub',
};

logger.info('数据库配置:', {
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  database: dbConfig.database,
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  ...dbConfig,
  synchronize: false,
  logging: ['error', 'warn', 'migration'],
  maxQueryExecutionTime: 1000,
  poolSize: 10,
  extra: {
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true
  },
  cache: {
    duration: 60000 // 1分钟缓存
  },
  entities: [User, Task, Role, Permission],
  migrations: [CreateUserTable1711174900000, CreateRbacTables1711175000000, InitialRbacData1711175100000],
  subscribers: [],
});

export async function initDatabase() {
  try {
    await AppDataSource.initialize();
    logger.info('数据库连接初始化成功');
    
    // 运行迁移
    const pendingMigrations = await AppDataSource.showMigrations();
    if (pendingMigrations) {
      logger.info('正在运行数据库迁移...');
      await AppDataSource.runMigrations();
      logger.info('数据库迁移完成');
    }
  } catch (error) {
    logger.error('数据库连接初始化失败:', error);
    throw error;
  }
} 