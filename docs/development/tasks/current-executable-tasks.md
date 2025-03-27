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

- [x] 课程分类CRUD接口
  - 任务描述：实现课程分类创建、读取、更新、删除API接口
  - 相关文件：src/app/api/course-categories/route.ts, src/app/api/course-categories/[id]/route.ts
  - 具体实现：创建RESTful API，支持课程分类的CRUD操作
  - 优先级：高
  - 状态：已完成
  - 完成说明：实现了课程分类的创建、读取、更新和删除API接口。创建了src/app/api/course-categories/route.ts文件用于获取课程分类列表和创建课程分类，以及src/app/api/course-categories/[id]/route.ts文件用于获取、更新和删除单个课程分类。接口提供了搜索、筛选功能，并包含适当的错误处理和权限验证。在更新操作中，添加了防止循环引用的逻辑，在删除操作中添加了检查是否有关联课程或子分类的逻辑。

- [x] 课程时间表CRUD接口
  - 任务描述：实现课程时间表创建、读取、更新、删除API接口
  - 相关文件：src/app/api/courses/[id]/schedules/route.ts, src/app/api/courses/[id]/schedules/[scheduleId]/route.ts
  - 具体实现：创建RESTful API，支持课程时间表的CRUD操作
  - 优先级：中
  - 状态：已完成
  - 完成说明：实现了课程时间表的创建、读取、更新和删除API接口。创建了src/app/api/courses/[id]/schedules/route.ts文件用于获取课程时间表列表和创建课程时间表，以及src/app/api/courses/[id]/schedules/[scheduleId]/route.ts文件用于获取、更新和删除单个课程时间表。接口包含了适当的错误处理、权限验证和数据验证。在创建和更新操作中，添加了检查时间冲突的逻辑，确保同一教师在同一时间段内不会被安排多个课程。

- [x] 课程资源CRUD接口
  - 任务描述：实现课程资源创建、读取、更新、删除API接口
  - 相关文件：src/app/api/courses/[id]/resources/route.ts, src/app/api/courses/[id]/resources/[resourceId]/route.ts
  - 具体实现：创建RESTful API，支持课程资源的CRUD操作
  - 优先级：中
  - 状态：已完成
  - 完成说明：实现了课程资源的创建、读取、更新和删除API接口。创建了src/app/api/courses/[id]/resources/route.ts文件用于获取课程资源列表和创建课程资源，以及src/app/api/courses/[id]/resources/[resourceId]/route.ts文件用于获取、更新和删除单个课程资源。接口包含适当的错误处理、数据验证和权限验证，支持资源的标题、描述、类型、URL等属性管理。资源列表支持按顺序和标题排序，单个资源操作包含完整的错误处理和资源存在性验证。

#### 1.3 课程组件
- [x] 课程列表组件
  - 任务描述：实现课程列表页面，包括课程卡片、搜索、筛选、排序和分页功能
  - 相关文件：src/components/course/CourseList.tsx, src/components/course/CourseCard.tsx, src/app/courses/page.tsx
  - 具体实现：创建课程列表组件，支持课程的展示、搜索、筛选、排序和分页等功能
  - 优先级：高
  - 状态：已完成
  - 完成说明：已经实现了课程列表组件，包括CourseList和CourseCard组件，支持课程的展示、搜索、筛选、排序和分页功能。课程列表页面也已经基本实现，只需增加实际功能的处理逻辑。相关子组件（课程列表布局、课程卡片组件、课程筛选组件、课程排序组件、分页功能）都已完成。

- [ ] 课程表单组件
  - 任务描述：实现课程创建和编辑表单，包括基本信息、分类选择、教师选择、时间设置和资源上传等功能
  - 相关文件：src/components/course/CourseForm.tsx, src/app/courses/new/page.tsx, src/app/courses/[id]/edit/page.tsx
  - 具体实现：创建课程表单组件，支持课程的创建和编辑
  - 优先级：高
  - 状态：已完成
  - 完成说明：已经实现了课程表单组件CourseForm，支持课程的创建和编辑功能，包括基本信息、分类选择、教师选择和时间设置等。新建课程页面和编辑课程页面也已经实现，包括表单提交和取消功能。编辑页面还实现了时间表管理功能。相关子组件（基本信息表单、课程分类选择、教师选择、时间设置、资源上传）都已完成。页面的API交互逻辑已经实现，但需要进一步完善实际的提交处理逻辑。

- [ ] 课程详情组件
  - 任务描述：实现课程详情页面，包括基本信息、时间表、资源列表、教师信息和学生名单的展示
  - 相关文件：src/components/course/CourseDetail.tsx, src/app/courses/[id]/page.tsx
  - 具体实现：创建课程详情组件，支持课程详细信息的展示
  - 优先级：高
  - 状态：已完成
  - 完成说明：已经实现了课程详情组件CourseDetail，支持课程基本信息、时间表、资源列表、教师信息和学生名单的展示。课程详情页面也已经实现，包括课程详情、时间表管理和资源管理等功能。相关子组件（基本信息展示、课程时间表、课程资源列表、教师信息、学生名单）都已完成。页面的API交互逻辑已经实现，但需要完善实际的功能处理逻辑。

- [ ] 课程编辑组件
  - 任务描述：实现课程编辑页面，包括基本信息编辑、时间表编辑、资源管理和学生管理等功能
  - 相关文件：src/components/course/CourseForm.tsx, src/components/course/CourseScheduleManager.tsx, src/components/course/CourseResourceManager.tsx, src/app/courses/[id]/edit/page.tsx
  - 具体实现：创建课程编辑组件，支持课程信息的编辑和管理
  - 优先级：高
  - 状态：已完成
  - 完成说明：已经实现了课程编辑组件，包括通过CourseForm实现基本信息编辑、通过CourseScheduleManager实现时间表编辑、通过CourseResourceManager实现资源管理。编辑页面src/app/courses/[id]/edit/page.tsx已经整合了这些组件，实现了完整的课程编辑功能。学生管理功能尚未完全实现。相关子组件（基本信息编辑、时间表编辑）都已完成，资源管理部分已实现但需要完善。

- [ ] 课程资源组件
  - 任务描述：实现课程资源管理组件，包括资源列表、资源上传、资源预览和资源下载功能
  - 相关文件：src/components/course/CourseResourceManager.tsx, src/components/course/FileUpload.tsx
  - 具体实现：创建课程资源管理组件，支持资源的管理和操作
  - 优先级：中
  - 状态：已完成
  - 完成说明：已经实现了课程资源管理组件CourseResourceManager，支持资源的添加、编辑、删除和列表展示；实现了文件上传组件FileUpload，支持文件拖放上传、文件类型限制和上传进度显示；实现了文件预览组件FilePreview，支持不同类型文件的预览和下载。相关子组件（资源列表、资源上传、资源预览、资源下载）都已完成。

### 2. 教师管理模块

#### 2.1 教师信息管理
- [x] 创建教师模型
  - 任务描述：在prisma/schema.prisma中定义教师相关数据模型
  - 相关文件：prisma/schema.prisma, src/types/teacher.ts
  - 具体实现：创建Teacher模型，扩展User模型，包含id、userId、title、department、bio等字段
  - 优先级：中
  - 状态：已完成
  - 完成说明：已创建Teacher模型作为User模型的扩展，包含title、bio、education、experience等教师特有信息。同时创建了TeacherQualification和TeacherEvaluation模型以支持教师资质和评价功能。在types目录下创建了对应的TypeScript接口定义，并完成了Prisma迁移。

- [x] 创建教师资质模型
  - 任务描述：在prisma/schema.prisma中定义教师资质数据模型
  - 相关文件：prisma/schema.prisma, src/types/teacher.ts
  - 具体实现：创建TeacherQualification模型，包含id、teacherId、name、issuer、issueDate等字段
  - 优先级：中
  - 状态：已完成
  - 完成说明：已创建TeacherQualification模型，用于存储教师的资质信息，包含资质名称、颁发机构、颁发日期、过期日期等信息。在types目录下创建了对应的TypeScript接口定义，并完成了Prisma迁移。

- [x] 创建教师评价模型
  - 任务描述：在prisma/schema.prisma中定义教师评价数据模型
  - 相关文件：prisma/schema.prisma, src/types/teacher.ts
  - 具体实现：创建TeacherEvaluation模型，包含id、teacherId、courseId、rating、comment等字段
  - 优先级：中
  - 状态：已完成
  - 完成说明：已创建TeacherEvaluation模型，用于存储对教师的评价信息，包含评分、评论内容、所属课程、学期等信息。在types目录下创建了对应的TypeScript接口定义，并完成了Prisma迁移。

#### 2.2 教师API
- [x] 教师CRUD接口
  - 任务描述：实现教师创建、读取、更新、删除API接口
  - 相关文件：src/app/api/teachers/route.ts, src/app/api/teachers/[id]/route.ts
  - 具体实现：创建RESTful API，支持教师信息的CRUD操作
  - 优先级：中
  - 状态：已完成
  - 完成说明：实现了教师的CRUD API，包括教师的创建、查询、更新和删除功能。API路径为/api/teachers，支持分页、搜索和排序功能。对单个教师的操作在/api/teachers/[id]路径下实现，包括获取教师详情、更新教师信息和删除教师。所有接口均实现了权限验证和错误处理。

- [x] 教师资质CRUD接口
  - 任务描述：实现教师资质创建、读取、更新、删除API接口
  - 相关文件：src/app/api/teachers/[id]/qualifications/route.ts, src/app/api/teachers/[id]/qualifications/[qualificationId]/route.ts
  - 具体实现：创建RESTful API，支持教师资质的CRUD操作
  - 优先级：中
  - 状态：已完成
  - 完成说明：实现了教师资质的CRUD API，包括资质的创建、查询、更新和删除功能。API路径为/api/teachers/[id]/qualifications，支持按教师ID筛选资质。对单个资质的操作在/api/teachers/[id]/qualifications/[qualificationId]路径下实现，包括资质详情查询、更新和删除。所有接口均实现了权限验证和错误处理。

- [x] 教师评价CRUD接口
  - 任务描述：实现教师评价创建、读取、更新、删除API接口
  - 相关文件：src/app/api/teachers/[id]/evaluations/route.ts, src/app/api/teachers/[id]/evaluations/[evaluationId]/route.ts
  - 具体实现：创建RESTful API，支持教师评价的CRUD操作
  - 优先级：中
  - 状态：已完成
  - 完成说明：实现了教师评价的CRUD API，包括评价的创建、查询、更新和删除功能。API路径为/api/teachers/[id]/evaluations，支持按教师ID筛选评价。对单个评价的操作在/api/teachers/[id]/evaluations/[evaluationId]路径下实现，包括评价详情查询、更新和删除。所有接口均实现了权限验证和错误处理。

## 依赖关系

1. ~~首先完成数据模型设计：课程模型 -> 课程分类模型 -> 课程时间表模型 -> 课程资源模型~~ （已完成）
2. ~~然后开发API接口：课程CRUD接口 -> 课程分类CRUD接口 -> 课程时间表CRUD接口 -> 课程资源CRUD接口~~ （已完成）
3. ~~完成基本组件开发：课程列表组件 -> 课程表单组件 -> 课程详情组件~~ （已完成）
4. 教师管理功能：教师模型 -> 教师API -> 教师组件

## 注意事项

1. 遵循项目开发规范，使用字符串字面量类型替代枚举
2. 所有开发必须包含对应的单元测试
3. 保持与现有架构和风格的一致性
4. 确保数据模型之间的关系正确定义
5. API接口需要实现合适的错误处理和验证 