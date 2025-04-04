# AI 开发指南模板

## 目录

- [1. 产品目标](#1-产品目标)
- [2. 技术栈](#2-技术栈)
- [3. 工具链](#3-工具链)
- [4. 项目结构](#4-项目结构)
- [5. 项目阶段](#5-项目阶段)
- [6. 版本规划](#6-版本规划)
- [7. 进度跟踪](#7-进度跟踪)
- [8. 开发状态](#8-开发状态)
- [9. AI 开发流程](#9-ai-开发流程)
- [10. AI 决策指南](#10-ai-决策指南)
- [11. 本地开发环境](#11-本地开发环境)

## 1. 产品目标

### 1.1 核心目标
- [ ] 目标一
- [ ] 目标二
- [ ] 目标三

## 2. 技术栈

| 类别 | 选择 |
|------|------|
| 前端框架 | |
| 编程语言 | |
| 数据库 | |
| 认证方案 | |
| 样式方案 | |
| 表单验证 | |
| 测试框架 | |
| 代码质量 | |

## 3. 工具链

| 工具类型 | 选择 |
|---------|------|
| 包管理器 | |
| 开发环境 | |
| 版本控制 | |
| IDE | |
| CI/CD | |
| 文档工具 | |
| API测试 | |
| 代码风格 | |
| Git钩子 | |
| 提交规范 | |

## 4. 项目结构

### 4.1 推荐文件结构

```
src/
├── app/                # 应用页面
│   ├── (auth)/        # 认证相关页面
│   ├── api/           # API 路由
│   └── [其他页面]/    # 其他功能页面
├── components/         # 组件
│   ├── ui/            # UI 基础组件
│   ├── layout/        # 布局组件
│   └── features/      # 功能组件
├── lib/                # 工具函数和共享逻辑
├── types/              # 类型定义
└── __tests__/          # 测试文件

docs/
├── development/       # 开发相关文档
│   ├── workflow.md    # 开发工作流指南
│   ├── ai-development.md # AI开发指南
│   └── tasks/         # 开发任务分解
│       ├── v0.1.0-tasks.md # 版本0.1.0任务
│       └── [其他版本任务]
├── product/           # 产品相关文档
└── test-reports/      # 测试相关文档

[数据库配置目录]/
└── [数据库模型定义文件]
```

### 4.2 组件设计

| 组件类型 | 计划使用的组件 |
|---------|--------------|
| UI组件 | |
| 表单组件 | |
| 详情组件 | |
| 布局组件 | |

### 4.3 推荐插件

- [ ] ESLint
- [ ] Prettier
- [ ] Husky
- [ ] Commitlint
- [ ] 测试框架
- [ ] 其他插件

### 4.4 配置文件说明

| 配置文件 | 说明 |
|---------|------|
| .eslintrc.json | ESLint配置文件，定义代码规范和质量检查规则 |
| .prettierrc | Prettier代码格式化工具配置 |
| 框架配置文件 | 框架配置文件，包含路由、构建和环境设置 |
| tsconfig.json | TypeScript配置文件（如适用） |
| 样式工具配置 | 样式工具配置文件 |
| package.json | 项目依赖管理和脚本配置 |
| .env相关文件 | 环境变量配置文件 |
| .gitignore | Git忽略文件列表 |
| 测试框架配置 | 测试框架配置文件 |
| .editorconfig | 编辑器配置文件 |
| .husky/ | Git钩子配置目录 |
| commitlint.config.js | 提交信息规范检查配置 |

## 5. 项目阶段

### 5.1 项目初始化阶段
- [ ] 产品设计
- [ ] 版本计划
- [ ] 开发环境搭建
- [ ] 技术选型
- [ ] 基础架构搭建

### 5.2 项目计划阶段
- [ ] 设计开发计划
- [ ] 任务进度跟踪
- [ ] 质量控制机制
- [ ] 开发流程确定
- [ ] 团队协作方式

### 5.3 项目实施阶段
- [ ] 原子功能分解
- [ ] 功能开发
- [ ] 文档
- [ ] 代码审查
- [ ] 持续集成

### 5.4 项目测试阶段
- [ ] 单元测试
- [ ] 集成测试
- [ ] 端到端测试
- [ ] 性能测试
- [ ] 安全测试

### 5.5 项目验收阶段
- [ ] 功能验收
- [ ] 用户体验评估
- [ ] 性能评估
- [ ] 文档完整性检查
- [ ] 上线准备

## 6. 版本规划

### 6.1 版本列表

| 版本 | 名称 | 状态 |
|-----|------|------|
| v0.1.0 | | |
| v0.2.0 | | |
| v0.3.0 | | |

### 6.2 各版本需求

#### v0.1.0: [版本名称]
- [ ] 需求一
- [ ] 需求二
- [ ] 需求三

#### v0.2.0: [版本名称]
- [ ] 需求一
- [ ] 需求二
- [ ] 需求三

## 7. 进度跟踪

### 7.1 API接口进度

| API模块 | 接口 | 状态 |
|---------|------|------|
| 模块一 | 接口一 | [ ] |
| | 接口二 | [ ] |
| 模块二 | 接口一 | [ ] |
| | 接口二 | [ ] |

### 7.2 数据层进度

| 数据模型 | 状态 |
|---------|------|
| 模型一 | [ ] |
| 模型二 | [ ] |
| 模型三 | [ ] |

### 7.3 业务层进度

| 业务逻辑 | 状态 |
|---------|------|
| 逻辑一 | [ ] |
| 逻辑二 | [ ] |
| 逻辑三 | [ ] |

### 7.4 前端页面进度

| 页面 | 状态 |
|-----|------|
| 页面一 | [ ] |
| 页面二 | [ ] |
| 页面三 | [ ] |

## 8. 开发状态

### 8.1 当前开发阶段
[填入当前开发阶段]

### 8.2 当前版本
[填入当前版本]

### 8.3 当前需求
[填入当前需求]

### 8.4 当前任务
[填入当前任务]

### 8.5 最小可执行任务
- [ ] 任务一
- [ ] 任务二
- [ ] 任务三

### 8.6 相关文件
- [任务文件路径]
- [当前任务列表文件路径]

## 9. AI 开发流程

### 9.1 初始化阶段

#### 9.1.1 规范
- 明确项目目标和范围
- 确定技术栈和架构
- 设计数据模型和API
- 规划开发环境和工具链
- 制定编码规范和文档标准

#### 9.1.2 实施流程
1. 创建项目目录结构
2. 初始化版本控制仓库
3. 配置开发环境
4. 安装必要依赖
5. 设置基础配置文件
6. 初始化数据库
7. 创建基础组件库
8. 编写项目文档

### 9.2 计划阶段

#### 9.2.1 规范
- 明确功能需求清单
- 划分功能模块和优先级
- 确定开发周期和里程碑
- 制定质量控制标准
- 建立任务分配和跟踪机制

#### 9.2.2 实施流程
1. 根据需求拆分功能模块
2. 编写用户故事和验收标准
3. 排列功能优先级顺序
4. 制定版本发布计划
5. 创建任务跟踪文档
6. 分配开发资源
7. 建立沟通机制
8. 制定风险应对策略

### 9.3 实施阶段

#### 9.3.1 规范
- 遵循代码规范和命名约定
- 使用强类型（如适用）
- 模块化和组件化开发
- 持续集成和测试驱动开发
- 文档同步更新
- 代码审查和质量控制

#### 9.3.2 实施流程
1. 根据"当前任务判定规则"确定工作内容
2. 按照当前最小可执行任务列表开发
3. 遵守开发步骤：需求分析、代码编写、安全检查、文档更新、代码提交
4. 完成单元测试
5. 进行代码审查
6. 定期集成测试
7. 更新任务状态和进度

### 9.4 测试阶段

#### 9.4.1 规范
- 单元测试覆盖率要求
- 集成测试和端到端测试标准
- 性能测试基准
- 安全测试要点
- 测试文档和报告格式

#### 9.4.2 实施流程
1. 执行单元测试
2. 执行集成测试
3. 进行端到端测试
4. 性能和负载测试
5. 安全漏洞扫描
6. 用户体验测试
7. 生成测试报告
8. 修复发现的问题

### 9.5 验收阶段

#### 9.5.1 规范
- 功能完整性检查标准
- 性能指标验收标准
- 用户体验评估方法
- 文档完整性要求
- 上线准备清单

#### 9.5.2 实施流程
1. 功能完整性验证
2. 性能指标测试
3. 用户体验评估
4. 文档完整性检查
5. 系统安全评估
6. 编写版本发布说明
7. 准备运维和支持文档
8. 培训最终用户
9. 系统上线部署

## 10. AI 决策指南

### 10.1 任务判定规则

#### 10.1.1 决策流程图

```
A[验证是否存在未完成的当前执行计划] --> |是| B[B存在]
A --> |否| C[检查、更新项目文档]
C --> C1[询问是否开启下一个版本计划]
C1 --> |是| C2[将新计划更新到文档中]
B --> D[是否存在未完成的当前最小可执行任务列表]
D --> |否| E[根据当前执行计划分解任务]
D --> |是| F[继续开发工作]
E --> F
```

#### 10.1.2 决策点表格

| 决策ID | 判断条件 | 是 | 否 |
|--------|---------|-----|-----|
| [AI_DECISION_POINT:A] | 是否存在未完成的当前执行计划 | 转到B | 转到C |
| [AI_DECISION_POINT:B] | 未完成执行计划是否存在 | 转到D | N/A |
| [AI_DECISION_POINT:C] | 是否需要开启下一版本计划 | 更新新计划到文档 | 等待指令 |
| [AI_DECISION_POINT:D] | 是否存在未完成的最小可执行任务 | 转到F | 转到E |
| [AI_DECISION_POINT:E] | 任务分解是否完成 | 转到F | 继续分解任务 |
| [AI_DECISION_POINT:F] | 继续开发工作 | 执行最小可执行任务 | N/A |

### 10.2 执行步骤

#### 10.2.1 最小功能开发流程

[AI_TASK_FLOW] 开发最小功能时的执行步骤：

1. 需求分析、技术栈分析并更新当前最小可执行任务列表
2. 按照开发计划编辑代码
3. 检查代码上下文及安全性
4. 进行文档更新
5. 使用git提交全部代码并推送至远程服务器

#### 10.2.2 代码提交格式

| 类型 | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | feat: 添加用户认证功能 |
| fix | 修复Bug | fix: 修复列表分页问题 |
| docs | 文档更新 | docs: 更新API使用说明 |
| style | 代码风格修改 | style: 调整缩进格式 |
| refactor | 代码重构 | refactor: 优化查询逻辑 |
| test | 测试代码 | test: 添加API单元测试 |
| chore | 构建过程或辅助工具变动 | chore: 更新依赖版本 |

## 11. 本地开发环境概览

| 类别 | 配置 |
|------|------|
| 操作系统 | macOS 12.6.0 |
| 终端 | zsh with Oh-My-Zsh |
| 包管理器 | pnpm 8.6.12 |
| Node版本 | v18.16.1 LTS |
| 编辑器 | Cursor IDE (基于VSCode) |
| 代码风格 | ESLint + Prettier |
| 地理位置 | 中国 + 镜像加速 |
