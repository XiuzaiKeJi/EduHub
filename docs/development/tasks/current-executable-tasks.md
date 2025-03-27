# 当前最小可执行任务列表

## v0.3.0 教务管理功能

### 当前任务状态

根据v0.3.0任务计划分析，确定以下最小可执行任务列表：

### 1. 课程管理模块

#### 1.1 课程数据模型
- [x] 创建课程模型
  - 任务描述：在prisma/schema.prisma中定义课程相关数据模型
  - 相关文件：prisma/schema.prisma, src/types/course.ts
  - 具体实现：创建Course模型，包含id、title、description、credit、hours等基本字段
  - 优先级：高
  - 状态：已完成
  - 完成说明：在检查现有代码时发现课程模型已经在schema.prisma中定义，并在src/types/course.ts中有对应的TypeScript接口。模型字段已经包含了所需的属性，如id、name、description、code、startDate、endDate、status等。

- [x] 创建课程分类模型
  - 任务描述：在prisma/schema.prisma中定义课程分类数据模型
  - 相关文件：prisma/schema.prisma, src/types/course.ts
  - 具体实现：创建CourseCategory模型，包含id、name、description、parentId等字段
  - 优先级：高
  - 状态：已完成
  - 完成说明：在检查现有代码时发现课程分类模型已经在schema.prisma中定义，并在src/types/course.ts中有对应的TypeScript接口。模型字段已经包含了所需的属性，如id、name、description、parentId等。

- [x] 创建课程时间表模型
  - 任务描述：在prisma/schema.prisma中定义课程时间表数据模型
  - 相关文件：prisma/schema.prisma, src/types/course.ts
  - 具体实现：创建CourseSchedule模型，包含id、courseId、dayOfWeek、startTime、endTime等字段
  - 优先级：高
  - 状态：已完成
  - 完成说明：在检查现有代码时发现课程时间表模型已经在schema.prisma中定义，并在src/types/course.ts中有对应的TypeScript接口。模型字段已经包含了所需的属性，如id、courseId、dayOfWeek、startTime、endTime等。

- [x] 创建课程资源模型
  - 任务描述：在prisma/schema.prisma中定义课程资源数据模型
  - 相关文件：prisma/schema.prisma, src/types/course.ts
  - 具体实现：创建CourseResource模型，包含id、courseId、title、type、url等字段
  - 优先级：高
  - 状态：已完成
  - 完成说明：在检查现有代码时发现课程资源模型已经在schema.prisma中定义，并在src/types/course.ts中有对应的TypeScript接口。模型字段已经包含了所需的属性，如id、courseId、title、type、url等。

#### 1.2 课程API
- [x] 课程CRUD接口
  - 任务描述：实现课程创建、读取、更新、删除API接口
  - 相关文件：src/app/api/courses/route.ts, src/app/api/courses/[id]/route.ts
  - 具体实现：创建RESTful API，支持课程的CRUD操作
  - 优先级：高
  - 状态：已完成
  - 完成说明：实现了课程的创建、读取、更新和删除API接口。创建了src/app/api/courses/route.ts文件用于获取课程列表和创建课程，以及src/app/api/courses/[id]/route.ts文件用于获取、更新和删除单个课程。接口支持分页、搜索、筛选和排序功能，并包含适当的错误处理和权限验证。

- [ ] 课程分类CRUD接口
  - 任务描述：实现课程分类创建、读取、更新、删除API接口
  - 相关文件：src/app/api/course-categories/route.ts, src/app/api/course-categories/[id]/route.ts
  - 具体实现：创建RESTful API，支持课程分类的CRUD操作
  - 优先级：高

- [ ] 课程时间表CRUD接口
  - 任务描述：实现课程时间表创建、读取、更新、删除API接口
  - 相关文件：src/app/api/courses/[id]/schedules/route.ts
  - 具体实现：创建RESTful API，支持课程时间表的CRUD操作
  - 优先级：中

- [ ] 课程资源CRUD接口
  - 任务描述：实现课程资源创建、读取、更新、删除API接口
  - 相关文件：src/app/api/courses/[id]/resources/route.ts
  - 具体实现：创建RESTful API，支持课程资源的CRUD操作
  - 优先级：中

### 2. 教师管理模块

#### 2.1 教师信息管理
- [ ] 创建教师模型
  - 任务描述：在prisma/schema.prisma中定义教师相关数据模型
  - 相关文件：prisma/schema.prisma, src/types/teacher.ts
  - 具体实现：创建Teacher模型，扩展User模型，包含id、userId、title、department、bio等字段
  - 优先级：中

## 依赖关系

1. ~~首先完成数据模型设计：课程模型 -> 课程分类模型 -> 课程时间表模型 -> 课程资源模型~~ （已完成）
2. 然后开发API接口：~~课程CRUD接口~~ -> 课程分类CRUD接口 -> 课程时间表CRUD接口 -> 课程资源CRUD接口
3. 完成基本组件开发：课程列表组件 -> 课程表单组件 -> 课程详情组件
4. 教师管理功能：教师模型 -> 教师API -> 教师组件

## 注意事项

1. 遵循项目开发规范，使用字符串字面量类型替代枚举
2. 所有开发必须包含对应的单元测试
3. 保持与现有架构和风格的一致性
4. 确保数据模型之间的关系正确定义
5. API接口需要实现合适的错误处理和验证 