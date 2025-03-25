# 开发工作流

## 1. 开发环境设置

### 1.1 环境要求
- Node.js 18+
- pnpm 8+
- Git

### 1.2 项目初始化
```bash
# 克隆项目
git clone [项目地址]

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 2. 开发流程

### 2.1 分支管理
- main: 主分支，用于生产环境
- develop: 开发分支
- feature/*: 功能分支
  - feature/task-board: 任务看板功能
  - feature/teaching: 教学管理功能
  - feature/team: 团队协作功能
- bugfix/*: 修复分支
- release/*: 发布分支

### 2.2 Git 提交规范

#### 2.2.1 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 2.2.2 类型说明
- feat: 新功能
- fix: 修复问题
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- test: 测试用例修改
- chore: 其他修改

#### 2.2.3 示例
```
feat(task-board): 添加任务拖拽功能

- 实现任务卡片拖拽
- 添加拖拽动画效果
- 更新任务状态

Closes #123
```

### 2.3 开发步骤
1. 从 develop 分支创建功能分支
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature
```

2. 开发功能
- 遵循 TypeScript 规范
- 使用 Next.js 最佳实践
- 编写必要的测试
- 更新文档
- 确保代码符合教学管理需求

3. 提交代码
```bash
git add .
git commit -m "feat: 添加新功能"
```

4. 推送到远程
```bash
git push origin feature/your-feature
```

5. 创建 Pull Request
- 目标分支：develop
- 描述功能变更
- 添加相关测试
- 更新文档
- 确保符合教学管理规范

### 2.4 代码审查
- 确保代码符合规范
- 检查测试覆盖率
- 验证功能完整性
- 确认文档更新
- 验证教学管理功能
- 检查用户体验

## 3. CI/CD 配置

### 3.1 持续集成
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Run tests
      run: pnpm test
      
    - name: Build
      run: pnpm build
      
    - name: Lint
      run: pnpm lint
```

### 3.2 持续部署
```yaml
name: CD

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm build
      
    - name: Deploy
      run: |
        # 部署步骤
        echo "Deploying to production..."
```

## 4. 发布流程

### 4.1 准备发布
1. 从 develop 创建 release 分支
```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
```

2. 版本更新
- 更新版本号
- 更新 CHANGELOG.md
- 更新文档
- 更新教学管理说明

3. 测试验证
- 运行所有测试
- 进行功能测试
- 检查性能指标
- 验证教学管理功能
- 检查用户体验

### 4.2 发布
1. 合并到 main 分支
```bash
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags
```

2. 部署
- 构建生产版本
- 部署到服务器
- 验证部署结果
- 检查教学管理功能
- 验证用户体验

3. 更新 develop 分支
```bash
git checkout develop
git merge release/v1.0.0
git push origin develop
```

## 5. 维护流程

### 5.1 问题修复
1. 从 main 分支创建修复分支
```bash
git checkout main
git checkout -b bugfix/issue-description
```

2. 修复问题
- 编写测试用例
- 修复代码
- 更新文档
- 确保不影响教学管理功能

3. 提交修复
```bash
git add .
git commit -m "fix: 修复问题描述"
git push origin bugfix/issue-description
```

4. 创建 Pull Request
- 目标分支：main
- 描述修复内容
- 添加测试用例
- 验证教学管理功能

### 5.2 版本维护
- 定期更新依赖
- 检查安全漏洞
- 优化性能
- 更新文档
- 优化教学管理功能
- 改进用户体验
