# 数据模型文档

## 教学计划相关模型

### TeachingPlan（教学计划）
教学计划的基本信息模型，用于管理课程的教学计划。

#### 字段
- `id`: String (主键) - 唯一标识符
- `courseId`: String (外键) - 关联的课程ID
- `title`: String - 教学计划标题
- `description`: String? - 教学计划描述
- `objectives`: String? - 教学目标
- `semester`: String? - 学期
- `academicYear`: String? - 学年
- `createdAt`: DateTime - 创建时间
- `updatedAt`: DateTime - 更新时间

#### 关联
- `course`: Course - 关联的课程
- `progress`: TeachingPlanProgress[] - 教学计划进度列表
- `resources`: TeachingPlanResource[] - 教学计划资源列表

### TeachingPlanProgress（教学计划进度）
用于跟踪教学计划的进度情况。

#### 字段
- `id`: String (主键) - 唯一标识符
- `planId`: String (外键) - 关联的教学计划ID
- `title`: String - 进度项标题
- `description`: String? - 进度项描述
- `weekNumber`: Int? - 周次
- `status`: String - 状态（PLANNED/IN_PROGRESS/COMPLETED）
- `completionRate`: Float - 完成率（0-100）
- `startDate`: DateTime? - 开始日期
- `endDate`: DateTime? - 结束日期
- `note`: String? - 备注
- `createdAt`: DateTime - 创建时间
- `updatedAt`: DateTime - 更新时间

#### 关联
- `plan`: TeachingPlan - 关联的教学计划

### TeachingPlanResource（教学计划资源）
用于管理教学计划相关的资源文件。

#### 字段
- `id`: String (主键) - 唯一标识符
- `planId`: String (外键) - 关联的教学计划ID
- `title`: String - 资源标题
- `description`: String? - 资源描述
- `type`: String - 资源类型
- `url`: String - 资源URL
- `size`: Int? - 资源大小
- `format`: String? - 资源格式
- `order`: Int - 排序顺序
- `createdAt`: DateTime - 创建时间
- `updatedAt`: DateTime - 更新时间

#### 关联
- `plan`: TeachingPlan - 关联的教学计划 