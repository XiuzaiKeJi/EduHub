import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('基础接口')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: '首页' })
  getHello(): { message: string } {
    return { message: 'Welcome to EduHub API' }
  }

  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }
}
