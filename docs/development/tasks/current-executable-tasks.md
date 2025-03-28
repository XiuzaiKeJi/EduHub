# 当前可执行任务列表

## 课程管理模块

### 课程组件
- [x] 课程列表组件 (CourseList) - 2023-03-26
- [x] 课程卡片组件 (CourseCard) - 2023-03-26
- [x] 课程表单组件 (CourseForm) - 2023-03-26
- [x] 课程详情组件 (CourseDetail) - 2023-03-27
- [x] 课程分类组件 (CourseCategories) - 2023-03-27

### 课程页面
- [x] 课程列表页面 - 2023-03-26
  - [x] 支持分页
  - [x] 支持搜索
  - [x] 支持筛选
  - [x] 支持排序
- [x] 课程详情页面 - 2023-03-27
  - [x] 展示课程基本信息
  - [x] 展示课程分类
  - [x] 展示课程时间表
  - [x] 展示课程资源
- [x] 课程创建页面 - 2023-03-26
- [x] 课程编辑页面 - 2023-03-27

### 课程API
- [x] 课程API - 2023-03-26
  - [x] GET /api/courses - 查询课程列表
  - [x] POST /api/courses - 创建课程
  - [x] GET /api/courses/:id - 查询单个课程
  - [x] PATCH /api/courses/:id - 更新课程
  - [x] DELETE /api/courses/:id - 删除课程
- [x] 课程分类API - 2023-03-27
  - [x] GET /api/course-categories - 查询课程分类列表
  - [x] POST /api/course-categories - 创建课程分类
  - [x] GET /api/course-categories/:id - 查询单个课程分类
  - [x] PATCH /api/course-categories/:id - 更新课程分类
  - [x] DELETE /api/course-categories/:id - 删除课程分类
- [x] 课程时间表API - 2023-03-27
  - [x] GET /api/courses/:id/schedules - 查询课程时间表列表
  - [x] POST /api/courses/:id/schedules - 创建课程时间表
  - [x] GET /api/courses/:id/schedules/:scheduleId - 查询单个课程时间表
  - [x] PATCH /api/courses/:id/schedules/:scheduleId - 更新课程时间表
  - [x] DELETE /api/courses/:id/schedules/:scheduleId - 删除课程时间表

## 教师管理模块

### 教师数据模型
- [x] 实现Teacher模型 - 2023-03-27
  - 完成情况：已实现Teacher模型，扩展User模型，添加字段如id、userId、title、department、bio等。同时创建了TeacherQualification和TeacherEvaluation模型用于支持教师资质和评价，定义了相应的TypeScript接口并完成了Prisma迁移。
- [x] 实现TeacherQualification模型 - 2023-03-27
  - 完成情况：已创建TeacherQualification模型用于存储教师资质信息，包含id、teacherId、name、issuer、issueDate等字段。
- [x] 实现TeacherEvaluation模型 - 2023-03-27
  - 完成情况：已创建TeacherEvaluation模型用于存储教师评价信息，包含id、teacherId、courseId、rating、comment等字段。

### 教师API
- [x] 教师API - 2023-03-28
  - [x] GET /api/teachers - 查询教师列表
  - [x] POST /api/teachers - 创建教师
  - [x] GET /api/teachers/:id - 查询单个教师
  - [x] PATCH /api/teachers/:id - 更新教师
  - [x] DELETE /api/teachers/:id - 删除教师
- [x] 教师资质API - 2023-03-28
  - [x] GET /api/teachers/:id/qualifications - 查询教师资质列表
  - [x] POST /api/teachers/:id/qualifications - 创建教师资质
  - [x] GET /api/teachers/:id/qualifications/:qualificationId - 查询单个教师资质
  - [x] PATCH /api/teachers/:id/qualifications/:qualificationId - 更新教师资质
  - [x] DELETE /api/teachers/:id/qualifications/:qualificationId - 删除教师资质
- [x] 教师评价API - 2023-03-28
  - [x] GET /api/teachers/:id/evaluations - 查询教师评价列表
  - [x] POST /api/teachers/:id/evaluations - 创建教师评价
  - [x] GET /api/teachers/:id/evaluations/:evaluationId - 查询单个教师评价
  - [x] PATCH /api/teachers/:id/evaluations/:evaluationId - 更新教师评价
  - [x] DELETE /api/teachers/:id/evaluations/:evaluationId - 删除教师评价

### 教师组件
- [x] 教师列表组件 (TeacherList) - 2023-03-28
- [x] 教师卡片组件 (TeacherCard) - 2023-03-28
- [x] 教师表单组件 (TeacherForm) - 2023-03-28
- [x] 教师详情组件 (TeacherDetail) - 2023-03-28
- [x] 教师资质表单组件 (QualificationForm) - 2023-03-28
- [x] 教师评价表单组件 (EvaluationForm) - 2023-03-28

### 教师页面
- [x] 教师列表页面 - 2023-03-28
  - [x] 支持分页
  - [x] 支持搜索
  - [x] 支持筛选
  - [x] 支持排序
- [x] 教师详情页面 - 2023-03-28
  - [x] 展示教师基本信息
  - [x] 展示教师资质
  - [x] 展示教师评价
- [x] 教师创建页面 - 2023-03-28
- [x] 教师编辑页面 - 2023-03-28
- [x] 教师资质管理页面 - 2023-03-28
  - [x] 添加资质页面
  - [x] 编辑资质页面
- [x] 教师评价管理页面 - 2023-03-28
  - [x] 添加评价页面
  - [x] 编辑评价页面

## 教学计划模块

### 教学计划数据模型
- [x] 实现TeachingPlan模型
  - 实现TeachingPlan模型，包含id、courseId、title、description、objectives等字段
- [x] 实现TeachingPlanProgress模型
  - 实现TeachingPlanProgress模型，包含id、planId、title、status、completionRate等字段
- [x] 实现TeachingPlanResource模型
  - 实现TeachingPlanResource模型，包含id、planId、title、type、url等字段

### 教学计划API
- [x] 教学计划API
  - [x] GET /api/courses/:id/teaching-plans - 查询教学计划列表
  - [x] POST /api/courses/:id/teaching-plans - 创建教学计划
  - [x] GET /api/courses/:id/teaching-plans/:planId - 查询单个教学计划
  - [x] PATCH /api/courses/:id/teaching-plans/:planId - 更新教学计划
  - [x] DELETE /api/courses/:id/teaching-plans/:planId - 删除教学计划
- [x] 教学计划进度API
  - [x] GET /api/courses/:id/teaching-plans/:planId/progress - 查询教学计划进度列表
  - [x] POST /api/courses/:id/teaching-plans/:planId/progress - 创建教学计划进度
  - [x] GET /api/courses/:id/teaching-plans/:planId/progress/:progressId - 查询单个教学计划进度
  - [x] PATCH /api/courses/:id/teaching-plans/:planId/progress/:progressId - 更新教学计划进度
  - [x] DELETE /api/courses/:id/teaching-plans/:planId/progress/:progressId - 删除教学计划进度
- [x] 教学计划资源API
  - [x] GET /api/courses/:id/teaching-plans/:planId/resources - 查询教学计划资源列表
  - [x] POST /api/courses/:id/teaching-plans/:planId/resources - 创建教学计划资源
  - [x] GET /api/courses/:id/teaching-plans/:planId/resources/:resourceId - 查询单个教学计划资源
  - [x] PATCH /api/courses/:id/teaching-plans/:planId/resources/:resourceId - 更新教学计划资源
  - [x] DELETE /api/courses/:id/teaching-plans/:planId/resources/:resourceId - 删除教学计划资源

## 教学计划组件
- [ ] 教学计划列表组件 (TeachingPlanList)
- [ ] 教学计划卡片组件 (TeachingPlanCard)
- [ ] 教学计划表单组件 (TeachingPlanForm)
- [ ] 教学计划详情组件 (TeachingPlanDetail)
- [ ] 教学计划进度组件 (TeachingPlanProgress)
- [ ] 教学计划资源组件 (TeachingPlanResource)

## 依赖关系

1. ~~首先完成数据模型设计：课程模型 -> 课程分类模型 -> 课程时间表模型 -> 课程资源模型~~ （已完成）
2. ~~然后开发API接口：课程CRUD接口 -> 课程分类CRUD接口 -> 课程时间表CRUD接口 -> 课程资源CRUD接口~~ （已完成）
3. ~~完成基本组件开发：课程列表组件 -> 课程表单组件 -> 课程详情组件~~ （已完成）
4. ~~教师管理功能：教师模型 -> 教师API -> 教师组件~~ （已完成）
5. ~~教学计划功能：教学计划模型 -> 教学计划API~~ （已完成）
6. 教学计划组件：教学计划列表组件 -> 教学计划表单组件 -> 教学计划详情组件

## 注意事项

1. 遵循项目开发规范，使用字符串字面量类型替代枚举
2. 所有开发必须包含对应的单元测试
3. 保持与现有架构和风格的一致性
4. 确保数据模型之间的关系正确定义
5. API接口需要实现合适的错误处理和验证 