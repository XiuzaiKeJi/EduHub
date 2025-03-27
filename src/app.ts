import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import taskRoutes from './routes/taskRoutes'

const app = express()

// 中间件
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

// 错误处理
app.use(errorHandler)

export default app 