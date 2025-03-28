# AI 开发指南

## 1. 产品目标
EduHub 是一个基于 Cursor Agent 全自动开发的任务看板（教务中心）系统，以任务管理为核心，支持小学日常办公任务管理工作。系统设计轻量级、高效、易维护，区别于传统的教育管理系统。

### 核心目标
- 提供高效的教务任务管理系统
- 实现教务工作流程数字化
- 优化教学资源配置
- 提高教务团队协作效率
- 提供数据支持的决策依据

## 2. 技术栈
- **前端框架**: Next.js 14, React 18
- **编程语言**: TypeScript 5
- **数据库**: Prisma + SQLite
- **认证**: NextAuth.js
- **样式**: Tailwind CSS
- **表单验证**: Zod
- **测试**: Jest
- **代码质量**: ESLint, Prettier

## 3. 工具链
- **包管理器**: pnpm 8+
- **开发环境**: Node.js 18+
- **版本控制**: Git
- **IDE**: Cursor IDE
- **CI/CD**: GitHub Actions
- **文档**: Markdown
- **API测试**: Postman/Thunder Client
- **代码风格**: EditorConfig, Prettier
- **Git钩子**: Husky
- **提交规范**: Commitlint

## 4. 项目结构（文件索引、已使用插件、已使用组件）
### 文件索引
```
src/
├── app/                    # Next.js App Router 页面
│   ├── (auth)/            # 认证相关页面（路由组）
│   ├── api/               # API 路由
│   │   ├── auth/          # 认证相关API
│   │   ├── courses/       # 课程相关API
│   │   │   └── [id]/      # 单个课程API
│   │   │       └── schedules/ # 课程时间表API
│   │   │           └── [scheduleId]/ # 单个课程时间表API
│   │   └── course-categories/ # 课程分类API
│   │       └── [id]/      # 单个课程分类API
│   ├── courses/          # 课程相关页面
│   ├── __tests__/        # 页面测试
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   └── globals.css       # 全局样式
├── components/           # React 组件
│   ├── ui/              # UI 基础组件
│   ├── layout/          # 布局组件
│   └── features/        # 功能组件
├── lib/                  # 工具函数和共享逻辑
│   ├── auth/            # 认证相关
│   ├── db/              # 数据库相关
│   └── utils/           # 通用工具
├── types/               # TypeScript 类型定义
├── __mocks__/           # 测试模拟
├── middleware.ts        # Next.js 中间件
└── middleware.test.ts   # 中间件测试
docs/
├── development/         # 开发相关文档
│   ├── workflow.md     # 开发工作流指南
│   ├── ai-development.md # AI开发指南
│   ├── cursor-guidelines.md # Cursor IDE使用指南
│   └── tasks/          # 开发任务分解
│       ├── v0.1.0-tasks.md # 基础架构与用户认证任务
│       ├── v0.2.0-tasks.md # 任务管理核心功能任务
│       ├── v0.3.0-tasks.md # 教务管理功能任务
│       ├── v0.4.0-tasks.md # 团队协作功能任务
│       ├── v0.5.0-tasks.md # 数据统计功能任务
│       ├── v0.6.0-tasks.md # 系统优化与完善任务
│       └── current-executable-tasks.md # 当前最小可执行任务列表
├── product/            # 产品相关文档
│   ├── guide.md       # 产品文档编写规范
│   └── prd/           # 产品需求文档
│       ├── product-design.md # 产品设计文档
│       ├── user-stories.md   # 用户故事
│       └── data-model.md     # 数据模型设计
└── test-reports/      # 测试相关文档
    └── guide.md      # 测试文档编写规范
prisma/
└── schema.prisma      # 数据库模型定义
```

### 已使用组件
- **UI组件**: TaskList, TaskCard, TaskFilters, TaskSort, Badge, CourseList, CourseCard, TeacherList, TeacherCard
- **表单组件**: TaskForm, TaskEditForm, CourseForm, TeacherForm, QualificationForm, EvaluationForm
- **详情组件**: TaskDetail, CourseDetail, TeacherDetail
- **布局组件**: Layout, Header, Sidebar, Footer

### 已使用插件
- ESLint
- Prettier
- Husky
- Commitlint
- Jest
- SWC
- PostCSS
- Tailwind CSS
- Zod

### 已使用的配置文件及说明
- **.eslintrc.json** - ESLint配置文件，定义代码规范和质量检查规则
- **.prettierrc** - Prettier代码格式化工具配置，确保代码风格一致性
- **next.config.js** - Next.js框架配置文件，包含路由、构建和环境设置
- **tsconfig.json** - TypeScript配置文件，定义编译选项和类型检查规则
- **tailwind.config.js** - Tailwind CSS配置文件，定制设计系统和主题
- **postcss.config.js** - PostCSS配置文件，处理CSS转换和优化
- **package.json** - 项目依赖管理和脚本配置
- **.env.local** - 本地环境变量配置文件（不提交到版本控制）
- **.env** - 环境变量配置基础文件
- **.gitignore** - Git忽略文件列表
- **jest.config.js** - Jest测试框架配置
- **.editorconfig** - 编辑器配置文件，确保不同IDE下代码格式一致性
- **.husky/** - Git钩子配置目录，管理提交前的代码检查
- **commitlint.config.js** - 提交信息规范检查配置

## 5. 项目阶段
### 项目初始化阶段 ✓
- 产品设计 ✓ - `docs/product/prd/product-design.md`
- 版本计划 ✓ - `docs/development/tasks/` 下的版本任务文件
- 开发环境搭建 ✓ - 根目录配置文件（package.json, .eslintrc.json等）
- 技术选型 ✓ - `docs/development/ai-development.md` 的技术栈部分
- 基础架构搭建 ✓ - 项目目录结构和基础框架文件

### 项目计划阶段 ✓
- 设计开发计划 ✓ - `docs/development/tasks/` 下的各版本任务计划文件
- 任务进度跟踪 ✓ - `docs/development/tasks/current-executable-tasks.md`
- 质量控制机制 ✓ - 单元测试配置和代码审查规则
- 开发流程确定 ✓ - `docs/development/ai-development.md` 的AI agent实施流程部分
- 团队协作方式 ✓ - 版本控制和提交规范配置（husky, commitlint）

### 项目实施阶段 (进行中)
- 原子功能分解 ✓ - `docs/development/tasks/*.md`
- 功能开发 (进行中) - `src/` 下的代码文件 - 部分完成
- 测试与文档 (进行中) - `src/__tests__/` 和 `docs/` - 部分完成
- 代码审查 (进行中) - Pull Request和代码审查记录 - 部分完成
- 持续集成 (进行中) - CI/CD配置文件和构建脚本 - 部分完成

### 项目测试阶段 (待进行)
- 单元测试 - `src/**/*.test.ts(x)` - 未开始
- 集成测试 - `src/__tests__/integration/` - 未开始
- 端到端测试 - `e2e/` - 未开始
- 性能测试 - `docs/test-reports/performance/` - 未开始
- 安全测试 - `docs/test-reports/security/` - 未开始

### 项目验收阶段 (待进行)
- 功能验收 - `docs/test-reports/acceptance/` - 未开始
- 用户体验评估 - `docs/test-reports/ux/` - 未开始
- 性能评估 - `docs/test-reports/performance-evaluation/` - 未开始
- 文档完整性检查 - 文档完整性清单 - 未开始
- 上线准备 - 部署脚本和生产环境配置 - 未开始

## 6. 当前版本规划（版本规划列表、各版本需求列表）
### 版本规划列表
- v0.1.0: 基础架构与用户认证 ✓
- v0.2.0: 任务管理核心功能 ✓
- v0.3.0: 教务管理功能 (进行中)
- v0.4.0: 团队协作功能
- v0.5.0: 数据统计功能
- v0.6.0: 系统优化与完善

### 各版本需求列表
#### v0.1.0: 基础架构与用户认证 ✓
- 项目初始化与基础架构搭建
- 数据库连接与模型设计
- 用户认证系统
- 用户权限管理
- 基础UI组件库

#### v0.2.0: 任务管理核心功能 ✓
- 任务数据模型
- 任务管理API
- 任务列表组件
- 任务表单组件
- 任务管理页面组件集成
- 任务详情展示
- 任务编辑功能

#### v0.3.0: 教务管理功能 (进行中)
- 课程管理
  - 课程数据模型 ✓
  - 课程API (进行中)
  - 课程组件 ✓
  - 课程页面 ✓
- 教学计划
  - 教学计划数据模型
  - 教学计划API
  - 教学计划组件
- 教务通知
  - 通知数据模型
  - 通知API
  - 通知组件
- 教师管理
  - 教师信息管理 ✓
  - 教师课程分配
  - 教师考核管理
- 学生管理
  - 学生信息管理
  - 学生课程管理
  - 学生成绩管理

## 7. 当前版本已完成情况 - 当前已完成的最小可执行任务列表
### 当前API接口完成情况 - 当前数据层完成情况
- 课程API：
  - 课程CRUD接口 ✓
  - 课程分类CRUD接口 ✓
  - 课程时间表CRUD接口 ✓
  - 课程资源CRUD接口 (进行中)
- 教师API：
  - 教师CRUD接口 ✓
  - 教师资质CRUD接口 ✓
  - 教师评价CRUD接口 ✓
- 数据模型：
  - 课程模型 ✓
  - 课程分类模型 ✓
  - 课程时间表模型 ✓
  - 课程资源模型 ✓
  - 教师模型 ✓
  - 教师资质模型 ✓
  - 教师评价模型 ✓

### 当前业务层完成情况
- 课程管理业务逻辑 ✓
- 课程分类管理业务逻辑 ✓
- 课程时间表管理业务逻辑 ✓
- 教师管理业务逻辑 ✓
- 教师资质管理业务逻辑 ✓
- 教师评价管理业务逻辑 ✓

### 当前前端页面完成情况
- 课程列表页面 ✓
- 课程详情页面 ✓
- 课程创建页面 ✓
- 课程编辑页面 ✓
- 教师列表页面 ✓
- 教师详情页面 ✓
- 教师创建页面 ✓
- 教师编辑页面 ✓
- 教师资质管理页面 ✓
- 教师评价管理页面 ✓

## 8. 当前开发状态
### 当前所处开发阶段
项目实施阶段 (进行中)

### 当前版本规划
v0.3.0: 教务管理功能 (进行中)

### 当前需求
课程资源API开发、教学计划功能开发、教务通知功能开发

### 当前任务
完成课程资源CRUD接口开发

### 当前最小可执行任务
- 实现课程资源数据模型
- 开发课程资源API接口
- 实现课程资源组件
- 集成课程资源到课程详情页面

### 详情文件目录
- docs/development/tasks/v0.3.0-tasks.md - 教务管理功能任务
- docs/development/tasks/current-executable-tasks.md - 当前最小可执行任务列表

## 9. Cursor Agent 开发流程（AI agent规范、AI agent实施流程）
### 初始化阶段
#### 规范
- 明确项目目标和范围
- 确定技术栈和架构
- 设计数据模型和API
- 规划开发环境和工具链
- 制定编码规范和文档标准

#### 实施流程
1. 创建项目目录结构
2. 初始化Git仓库
3. 配置开发环境
4. 安装必要依赖
5. 设置基础配置文件
6. 初始化数据库
7. 创建基础组件库
8. 编写项目文档

### 计划阶段
#### 规范
- 明确功能需求清单
- 划分功能模块和优先级
- 确定开发周期和里程碑
- 制定质量控制标准
- 建立任务分配和跟踪机制

#### 实施流程
1. 根据需求拆分功能模块
2. 编写用户故事和验收标准
3. 排列功能优先级顺序
4. 制定版本发布计划
5. 创建任务跟踪文档
6. 分配开发资源
7. 建立沟通机制
8. 制定风险应对策略

### 实施阶段
#### 规范
- 遵循代码规范和命名约定
- 使用TypeScript强类型
- 模块化和组件化开发
- 持续集成和测试驱动开发
- 文档同步更新
- 代码审查和质量控制

#### 实施流程
1. 根据当前任务判定规则确定工作内容
2. 按照当前最小可执行任务列表开发
3. 遵守开发步骤：需求分析、代码编写、安全检查、文档更新、代码提交
4. 完成单元测试
5. 进行代码审查
6. 定期集成测试
7. 更新任务状态和进度

### 测试阶段
#### 规范
- 单元测试覆盖率要求
- 集成测试和端到端测试标准
- 性能测试基准
- 安全测试要点
- 测试文档和报告格式

#### 实施流程
1. 执行单元测试
2. 执行集成测试
3. 进行端到端测试
4. 性能和负载测试
5. 安全漏洞扫描
6. 用户体验测试
7. 生成测试报告
8. 修复发现的问题

### 验收阶段
#### 规范
- 功能完整性检查标准
- 性能指标验收标准
- 用户体验评估方法
- 文档完整性要求
- 上线准备清单

#### 实施流程
1. 功能完整性验证
2. 性能指标测试
3. 用户体验评估
4. 文档完整性检查
5. 系统安全评估
6. 编写版本发布说明
7. 准备运维和支持文档
8. 培训最终用户
9. 系统上线部署

### 当前任务判定规则
A验证是否存在未完成的当前执行计划 -> B
B不存在 -> C检查、更新项目文档并询问是否开启下一个版本计划（询问是否需要生成上一版本的单元测试报告），如开启需将新的计划更新到文档中
B存在 -> D是否存在未完成的当前最小可执行任务列表
D不存在 -> E根据当前执行计划，按照tasks中任务的详细描述，将任务分解成当前最小可执行任务列表（更新到文档中）
D存在、E -> F根据AI 开发指南和要求，继续开发工作

### 必须遵守执行步骤
当开发每个最小功能时请严格完整执行步骤（禁止构建测试）：
1. 需求分析、技术栈分析并更新当前最小可执行任务列表
2. 按照开发计划编辑代码
3. 检查代码上下文及安全性
4. 进行文档更新
5. 使用git提交全部代码并推送至远程服务器