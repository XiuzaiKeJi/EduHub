import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  // 配置静态文件服务
  app.useStaticAssets(join(__dirname, '..', 'src', 'public'), {
    index: 'index.html',
  })

  // 配置全局前缀
  const apiPrefix = configService.get('API_PREFIX', 'api')
  app.setGlobalPrefix(apiPrefix, {
    exclude: [''], // 排除根路径，允许访问静态文件
  })

  // 配置跨域
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('EduHub API')
    .setDescription('EduHub项目API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)

  // 启动应用
  const port = configService.get('PORT', 3000)
  const host = configService.get('HOST', 'localhost')
  await app.listen(port, host)

  const serverUrl = `http://${host}:${port}`
  console.log(`应用已启动: ${serverUrl}`)
  console.log(`API文档地址: ${serverUrl}/api-docs`)
  console.log(`API基础路径: ${serverUrl}/${apiPrefix}`)
}
bootstrap()
