import { execSync } from 'child_process'
import prisma from '../prisma'

beforeAll(async () => {
  // 重置测试数据库
  execSync('npx prisma db push --force-reset', { env: { ...process.env, DATABASE_URL: 'file:./test.db' } })
  
  // 等待数据库连接
  await prisma.$connect()
})

afterAll(async () => {
  // 清理连接
  await prisma.$disconnect()
}) 