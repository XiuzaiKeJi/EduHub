# Git Flow 工作流指南

## 分支说明

### 主要分支
- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于开发环境

### 辅助分支
- `feature/*`: 功能分支，用于开发新功能
- `release/*`: 发布分支，用于版本发布
- `hotfix/*`: 热修复分支，用于修复生产环境问题
- `support/*`: 支持分支，用于维护旧版本

## 工作流程

### 1. 开发新功能
```bash
# 从 develop 分支创建功能分支
git checkout develop
git checkout -b feature/your-feature-name

# 开发完成后合并回 develop
git checkout develop
git merge feature/your-feature-name --no-ff
```

### 2. 发布新版本
```bash
# 从 develop 分支创建发布分支
git checkout develop
git checkout -b release/v1.0.0

# 修复发布分支上的问题
# 完成后合并到 main 和 develop
git checkout main
git merge release/v1.0.0 --no-ff
git tag -a v1.0.0 -m "Release version 1.0.0"

git checkout develop
git merge release/v1.0.0 --no-ff
```

### 3. 修复生产环境问题
```bash
# 从 main 分支创建热修复分支
git checkout main
git checkout -b hotfix/issue-description

# 修复完成后合并到 main 和 develop
git checkout main
git merge hotfix/issue-description --no-ff
git tag -a v1.0.1 -m "Hotfix version 1.0.1"

git checkout develop
git merge hotfix/issue-description --no-ff
```

## 提交规范

### 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型说明
- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档修改
- `style`: 代码格式修改
- `refactor`: 代码重构
- `test`: 测试用例修改
- `chore`: 其他修改

### 示例
```
feat(task): 实现任务创建功能

- 添加任务创建表单
- 实现任务数据验证
- 添加任务创建成功提示

Closes #123
```

## 分支保护规则

### main 分支
- 禁止直接提交
- 必须通过 Pull Request 合并
- 需要至少一个代码审查
- 必须通过所有测试

### develop 分支
- 禁止直接提交
- 必须通过 Pull Request 合并
- 需要至少一个代码审查
- 必须通过所有测试

### 功能分支
- 命名规范：feature/功能名称
- 从 develop 分支创建
- 完成后合并回 develop

## 版本号规范

### 格式
```
主版本号.次版本号.修订号
```

### 规则
- 主版本号：重大更新
- 次版本号：功能更新
- 修订号：问题修复

## 注意事项

1. 保持分支同步
   - 定期从 develop 分支同步更新
   - 解决冲突后再提交

2. 代码审查
   - 提交前进行自测
   - 确保代码符合规范
   - 编写必要的测试用例

3. 文档更新
   - 及时更新相关文档
   - 记录重要的变更

4. 版本发布
   - 遵循语义化版本
   - 更新更新日志
   - 标记版本标签 