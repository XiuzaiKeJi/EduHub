# EduHub 数据库设计规范

## 一、通用规范

### 1.1 命名规范
- 表名使用小写字母，单词间用下划线分隔
- 主键统一命名为 `id`
- 外键命名格式：`表名单数_id`
- 创建时间字段：`created_at`
- 更新时间字段：`updated_at`
- 删除时间字段：`deleted_at`（用于软删除）
- 状态字段：`status`
- 排序字段：`sort_order`

### 1.2 字段规范
- 所有表必须包含 `id`, `created_at`, `updated_at` 字段
- 支持软删除的表必须包含 `deleted_at` 字段
- 需要排序的表必须包含 `sort_order` 字段
- 布尔类型字段使用 `is_` 前缀
- 时间戳字段使用 `_at` 后缀
- 外键字段使用 `_id` 后缀

### 1.3 索引规范
- 主键必须是自增整数
- 经常用于查询的字段建立索引
- 外键字段必须建立索引
- 联合索引最左原则
- 索引命名：`idx_表名_字段名`

### 1.4 约束规范
- 必须指定字段是否允许为空
- 必须指定字段默认值
- 字符串类型必须指定长度
- 数字类型必须指定精度

## 二、具体表设计规范

### 2.1 用户认证相关表

#### users 表
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mobile VARCHAR(20) UNIQUE,
    real_name VARCHAR(50),
    avatar_url VARCHAR(255),
    status TINYINT NOT NULL DEFAULT 1,
    is_admin BOOLEAN NOT NULL DEFAULT 0,
    last_login_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);
```

#### roles 表
```sql
CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);
```

#### permissions 表
```sql
CREATE TABLE permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 任务管理相关表

#### tasks 表
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status_id INTEGER NOT NULL,
    priority TINYINT NOT NULL DEFAULT 0,
    creator_id INTEGER NOT NULL,
    assignee_id INTEGER,
    due_date DATETIME,
    completed_at DATETIME,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (status_id) REFERENCES task_statuses(id),
    FOREIGN KEY (creator_id) REFERENCES users(id),
    FOREIGN KEY (assignee_id) REFERENCES users(id)
);
```

#### task_statuses 表
```sql
CREATE TABLE task_statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 三、数据库操作规范

### 3.1 查询规范
- 禁止使用 `SELECT *`
- 查询条件必须使用索引字段
- 分页查询必须指定 `LIMIT` 和 `OFFSET`
- 关联查询不超过3张表

### 3.2 更新规范
- 更新语句必须带有 WHERE 条件
- 批量更新必须控制数量
- 必须更新 `updated_at` 字段

### 3.3 删除规范
- 优先使用软删除
- 物理删除必须带有 WHERE 条件
- 批量删除必须控制数量

### 3.4 事务规范
- 涉及多表操作必须使用事务
- 事务中避免长时间操作
- 事务中避免大量数据操作

## 四、性能优化

### 4.1 索引优化
- 合理使用联合索引
- 避免过多索引
- 定期维护索引

### 4.2 查询优化
- 使用 EXPLAIN 分析查询
- 避免全表扫描
- 合理使用子查询

### 4.3 数据量优化
- 大表分页查询
- 历史数据归档
- 冷热数据分离 