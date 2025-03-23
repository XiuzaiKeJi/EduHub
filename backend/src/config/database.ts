import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Task } from '../entities/Task';
import logger from '../utils/logger';

const {
  DB_HOST = 'localhost',
  DB_PORT = 3306,
  DB_USERNAME = 'root',
  DB_PASSWORD = 'root',
  DB_DATABASE = 'eduhub',
} = process.env;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, Task],
  subscribers: [],
  migrations: [],
});

export async function initDatabase() {
  try {
    await AppDataSource.initialize();
    logger.info('数据库连接初始化成功');
  } catch (error) {
    logger.error('数据库连接初始化失败:', error);
    throw error;
  }
} 