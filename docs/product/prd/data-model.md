# EduHub 数据模型设计

## 1. 用户模型 (User)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String
  role          UserRole  @default(STAFF)
  department    String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  tasks         Task[]    @relation("AssignedTo")
  createdTasks  Task[]    @relation("CreatedBy")
  comments      Comment[]
  notifications Notification[]
}

enum UserRole {
  ADMIN
  DIRECTOR
  STAFF
}
```

## 2. 任务模型 (Task)

```prisma
model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  startDate   DateTime?
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  createdBy   User      @relation("CreatedBy", fields: [creatorId], references: [id])
  creatorId   String
  assignedTo  User      @relation("AssignedTo", fields: [assigneeId], references: [id])
  assigneeId  String
  comments    Comment[]
  attachments Attachment[]
  tags        Tag[]
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

## 3. 评论模型 (Comment)

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  task      Task     @relation(fields: [taskId], references: [id])
  taskId    String
}
```

## 4. 附件模型 (Attachment)

```prisma
model Attachment {
  id        String   @id @default(cuid())
  name      String
  url       String
  type      String
  size      Int
  createdAt DateTime @default(now())
  task      Task     @relation(fields: [taskId], references: [id])
  taskId    String
}
```

## 5. 标签模型 (Tag)

```prisma
model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  color     String?
  tasks     Task[]
}
```

## 6. 通知模型 (Notification)

```prisma
model Notification {
  id        String   @id @default(cuid())
  title     String
  content   String
  type      NotificationType
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
}

enum NotificationType {
  TASK_ASSIGNED
  TASK_UPDATED
  TASK_COMPLETED
  COMMENT_ADDED
  SYSTEM_NOTICE
}
```

## 7. 课程模型 (Course)

```prisma
model Course {
  id          String   @id @default(cuid())
  name        String
  description String?
  startDate   DateTime
  endDate     DateTime
  status      CourseStatus @default(PLANNED)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tasks       Task[]
}

enum CourseStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

## 8. 任务依赖关系模型 (TaskDependency)

```prisma
model TaskDependency {
  id          String   @id @default(cuid())
  taskId      String
  task        Task     @relation(fields: [taskId], references: [id])
  dependsOnId String
  dependsOn   Task     @relation("TaskDependencies", fields: [dependsOnId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([taskId, dependsOnId])
}
```

## 9. 系统日志模型 (SystemLog)

```prisma
model SystemLog {
  id        String   @id @default(cuid())
  action    String
  details   String?
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  ip        String?
  userAgent String?
}
```

## 10. 数据备份模型 (Backup)

```prisma
model Backup {
  id        String   @id @default(cuid())
  filename  String
  path      String
  size      Int
  type      BackupType
  status    BackupStatus @default(PENDING)
  createdAt DateTime @default(now())
  completedAt DateTime?
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
}

enum BackupType {
  FULL
  INCREMENTAL
  CUSTOM
}

enum BackupStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}
```

## 11. 数据导入导出记录 (ImportExport)

```prisma
model ImportExport {
  id        String   @id @default(cuid())
  type      ImportExportType
  filename  String
  status    ImportExportStatus @default(PENDING)
  details   String?
  createdAt DateTime @default(now())
  completedAt DateTime?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}

enum ImportExportType {
  IMPORT
  EXPORT
}

enum ImportExportStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}
```

## 12. 关系说明

### 12.1 用户关系
- 一个用户可以创建多个任务
- 一个用户可以分配多个任务
- 一个用户可以发表多个评论
- 一个用户可以接收多个通知

### 12.2 任务关系
- 一个任务属于一个创建者
- 一个任务分配给一个执行者
- 一个任务可以有多个评论
- 一个任务可以有多个附件
- 一个任务可以有多个标签
- 一个任务可以关联到一个课程
- 一个任务可以有多个依赖任务
- 一个任务可以被多个其他任务依赖
- 一个任务可以有多个备份记录
- 一个任务可以关联到多个导入导出记录

### 12.3 其他关系
- 一个评论属于一个用户和一个任务
- 一个附件属于一个任务
- 一个标签可以关联到多个任务
- 一个通知属于一个用户
- 一个课程可以关联到多个任务
- 一个系统日志可以关联到用户（可选）
- 一个数据备份可以关联到用户（可选）
- 一个导入导出记录必须关联到用户 