# EduHub Frontend

## 项目简介

EduHub前端项目采用Vue 3 + TypeScript开发，提供简洁直观的任务看板界面。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia
- Vue Router

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
│   ├── board/      # 看板相关组件
│   └── common/     # 通用组件
├── composables/    # 组合式函数
├── layouts/        # 布局组件
├── pages/          # 页面组件
├── router/         # 路由配置
├── stores/         # 状态管理
├── styles/         # 全局样式
├── types/          # 类型定义
└── utils/          # 工具函数
```

## 开发指南

1. 安装依赖
```bash
pnpm install
```

2. 启动开发服务器
```bash
pnpm dev
```

3. 构建生产版本
```bash
pnpm build
```

## 核心组件

### TaskBoard
任务看板主组件，支持:
- 拖拽排序
- 状态切换
- 任务筛选
- 进度统计

### TaskCard
任务卡片组件，展示:
- 任务标题
- 优先级
- 截止日期
- 任务状态

### TaskForm
任务表单组件，用于:
- 创建任务
- 编辑任务
- 表单验证

## 开发规范

### 组件规范
- 使用 Composition API
- 使用 TypeScript 类型注解
- 遵循单一职责原则
- 保持组件轻量化

### 样式规范
- 使用 SCSS
- 遵循 BEM 命名
- 优先使用 Element Plus 样式变量
- 避免深层嵌套

### 状态管理
- 使用 Pinia 管理状态
- 按功能模块拆分 store
- 保持 store 结构扁平
- 使用 TypeScript 定义 store 类型

## 构建优化

- 路由懒加载
- 组件按需导入
- 资源压缩
- 缓存策略

## 开发命令

```bash
# 开发环境
pnpm dev

# 类型检查
pnpm type-check

# 代码格式化
pnpm format

# 代码检查
pnpm lint

# 单元测试
pnpm test:unit

# 构建
pnpm build
```

## 开发指南

### 环境要求
- Node.js 18.x 或更高版本
- pnpm 10.x 或更高版本

### 安装依赖
```bash
pnpm install
```

### 开发服务器
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 代码检查
```bash
pnpm lint
```

### 代码格式化
```bash
pnpm format
```

### 运行测试
```bash
pnpm test
```

## 开发规范

### 组件规范
- 使用 Composition API
- 组件名使用 PascalCase
- 文件名与组件名一致
- 每个组件一个文件
- 看板相关组件统一放在 board 目录
- 任务相关组件统一放在 task 目录

### 样式规范
- 使用 SCSS 预处理器
- BEM 命名规范
- 主题变量统一管理
- 响应式设计
- 拖拽交互样式统一

### TypeScript 规范
- 严格类型检查
- 接口优先
- 避免 any 类型
- 使用类型推导
- 任务和看板类型定义清晰

### 状态管理
- 使用 Pinia 进行状态管理
- 按模块划分 store
- 保持 store 简洁
- 使用组合式函数
- 任务状态变更追踪

## 路由配置

### 路由结构
```typescript
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'board',
        name: 'Board',
        component: BoardView,
        meta: {
          title: '任务看板',
          icon: 'board',
          roles: ['admin', 'leader', 'teacher']
        }
      }
    ]
  }
]
```

### 路由守卫
- 登录验证
- 角色权限控制
- 页面标题
- 进度条

## API 调用

### 请求封装
```typescript
import request from '@/utils/request'

export function getTaskList(boardId: string) {
  return request({
    url: `/api/v1/boards/${boardId}/tasks`,
    method: 'get'
  })
}
```

### 错误处理
- 统一错误处理
- 错误提示
- 登录失效处理
- 网络错误处理
- 任务操作失败恢复

## 看板功能

### 拖拽实现
- 使用 Vue Draggable
- 任务卡片拖拽
- 列表拖拽排序
- 状态自动更新
- 实时保存

### 数据可视化
- 使用 ECharts
- 任务统计图表
- 进度展示
- 工作量分析
- 性能优化

## 构建配置

### 开发环境
- 热模块替换
- 接口代理
- 源码映射
- 开发工具

### 生产环境
- 代码压缩
- 分包优化
- 缓存策略
- CDN 配置

## 部署说明

### Docker 部署
```bash
# 构建镜像
docker build -t eduhub-frontend .

# 运行容器
docker run -d -p 80:80 eduhub-frontend
```

### Nginx 配置
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

## 常见问题

### 开发问题
1. 看板拖拽不生效
   - 检查 Vue Draggable 配置
   - 确认事件绑定
   - 验证权限设置

2. 类型错误
   - 更新类型定义
   - 检查 tsconfig.json
   - 确保依赖版本兼容

3. 构建失败
   - 检查依赖版本
   - 清理构建缓存
   - 查看错误日志

## 更多资源
- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
- [Element Plus 文档](https://element-plus.org/)
- [Vue Draggable 文档](https://github.com/SortableJS/Vue.Draggable)
- [ECharts 文档](https://echarts.apache.org/)
