# Cursor 配置规则说明

## 配置文件位置

- `.cursor/settings.json`: Cursor 主配置文件
- `.editorconfig`: EditorConfig 配置文件
- `.prettierrc`: Prettier 格式化配置
- `.eslintrc.js`: ESLint 代码检查配置

## 编辑器设置

### 基本设置

- 自动保存: 焦点切换时
- 制表符大小: 2
- 标尺: 80 和 100 列
- 自动换行: 开启
- 括号对着色: 开启
- 缩进指南: 开启

### 文件处理

- 自动去除行尾空格
- 文件末尾插入空行
- 去除多余的空行
- 文件排除规则:
  - node_modules
  - dist
  - .git

## 语言特定配置

### TypeScript

- 函数调用补全
- 自动导入
- 文件移动时更新导入
- 相对路径导入

### JavaScript

- 函数调用补全
- 自动导入
- 文件移动时更新导入

## 代码质量工具

### ESLint

- 启用状态: 开启
- 运行时机: 保存时
- 包管理器: pnpm

### Prettier

- 启用状态: 开启
- 配置要求: 必须
- EditorConfig: 启用

## 文件类型和位置

### 源代码

- `src/`: 源代码目录
  - `*.ts`: TypeScript 源文件
  - `*.tsx`: React TypeScript 组件
  - `*.js`: JavaScript 源文件
  - `*.jsx`: React JavaScript 组件

### 配置文件

- `config/`: 配置文件目录
  - `*.config.ts`: TypeScript 配置文件
  - `*.config.js`: JavaScript 配置文件

### 测试文件

- `test/`: 测试文件目录
  - `*.test.ts`: TypeScript 测试文件
  - `*.spec.ts`: TypeScript 规格文件
  - `*.e2e.ts`: 端到端测试文件

### 文档

- `docs/`: 文档目录
  - `*.md`: Markdown 文档
  - `*.pdf`: PDF 文档

### 资源文件

- `public/`: 公共资源目录
  - `*.svg`: SVG 图片
  - `*.png`: PNG 图片
  - `*.jpg`: JPG 图片

### 样式文件

- `styles/`: 样式文件目录
  - `*.css`: CSS 样式文件
  - `*.scss`: SCSS 样式文件
  - `*.less`: Less 样式文件

### 类型定义

- `types/`: 类型定义目录
  - `*.d.ts`: TypeScript 类型定义文件

### 脚本文件

- `scripts/`: 脚本文件目录
  - `*.sh`: Shell 脚本
  - `*.js`: Node.js 脚本

## 最佳实践

1. 文件命名

   - 使用小写字母
   - 单词间使用连字符(-)
   - 类型和测试文件使用点(.)分隔

2. 目录结构

   - 按功能模块划分
   - 保持层级浅
   - 相关文件放在一起

3. 代码组织

   - 每个文件一个主要功能
   - 相关功能放在同一目录
   - 共享代码放在 common 目录

4. 导入顺序

   - 第三方库
   - 项目模块
   - 相对路径导入
   - 样式文件

5. 文件大小
   - 单个文件不超过 400 行
   - 组件文件不超过 300 行
   - 工具函数文件不超过 200 行
