# EduHub 小学智慧管理系统部署指南

## 目录
- [环境要求](#环境要求)
- [本地开发环境](#本地开发环境)
- [测试环境](#测试环境)
- [生产环境](#生产环境)
- [Docker部署](#docker部署)
- [系统监控](#系统监控)
- [数据备份](#数据备份)
- [故障处理](#故障处理)

## 环境要求

### 硬件要求
- CPU: 2核或更高
- 内存: 4GB或更高
- 磁盘: 20GB或更高
- 网络: 100Mbps或更高

### 软件要求
- 操作系统: Ubuntu 20.04/22.04 LTS
- Node.js: 18.x
- MySQL: 8.0
- pnpm: 8.x
- Nginx: 1.20或更高
- Docker(可选): 24.x

## 本地开发环境

### 1. 基础环境配置
```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 安装MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

### 2. 数据库配置
```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE eduhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 创建用户并授权
mysql -u root -p -e "CREATE USER 'eduhub'@'localhost' IDENTIFIED BY 'your_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON eduhub.* TO 'eduhub'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### 3. 项目部署
```bash
# 克隆项目
git clone https://github.com/your-org/eduhub.git
cd eduhub

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.development

# 修改环境变量
vim .env.development
```

环境变量配置示例:
```env
# 服务配置
NODE_ENV=development
PORT=3001

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=eduhub
DB_PASS=your_password
DB_NAME=eduhub

# JWT配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# 文件上传配置
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### 4. 启动服务
```bash
# 开发环境
pnpm dev

# 检查服务状态
curl http://localhost:3001/health
```

## 测试环境

### 1. 环境准备
```bash
# 配置测试环境变量
cp .env.example .env.test

# 创建测试数据库
mysql -u root -p -e "CREATE DATABASE eduhub_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. 运行测试
```bash
# 运行所有测试
pnpm test

# 运行特定测试
pnpm test:unit
pnpm test:e2e
```

## 生产环境

### 1. 服务器准备
```bash
# 安装必要软件
sudo apt install -y nginx certbot python3-certbot-nginx

# 配置防火墙
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. SSL配置
```bash
# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 配置自动续期
sudo systemctl enable certbot.timer
```

### 3. Nginx配置
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # 前端文件
    location / {
        root /var/www/eduhub/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 上传文件目录
    location /uploads {
        alias /var/www/eduhub/uploads;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### 4. PM2部署
```bash
# 安装PM2
npm install -g pm2

# 启动服务
pm2 start ecosystem.config.js --env production

# 设置开机自启
pm2 startup
pm2 save
```

## Docker部署

### 1. 开发环境
```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 2. 生产环境
```bash
# 使用生产配置
docker-compose -f docker-compose.prod.yml up -d

# 查看服务状态
docker-compose -f docker-compose.prod.yml ps
```

## 系统监控

### 1. 服务监控
```bash
# 查看服务状态
pm2 status

# 查看资源使用
pm2 monit

# 查看日志
pm2 logs
```

### 2. 日志管理
- 应用日志: `/var/log/eduhub/app.log`
- 访问日志: `/var/log/nginx/access.log`
- 错误日志: `/var/log/nginx/error.log`

## 数据备份

### 1. 数据库备份
```bash
#!/bin/bash
# /etc/cron.daily/backup-eduhub-db

BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d)
BACKUP_FILE="eduhub_${DATE}.sql"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u root -p eduhub > "$BACKUP_DIR/$BACKUP_FILE"

# 压缩备份文件
gzip "$BACKUP_DIR/$BACKUP_FILE"

# 删除30天前的备份
find $BACKUP_DIR -name "eduhub_*.sql.gz" -mtime +30 -delete
```

### 2. 文件备份
```bash
#!/bin/bash
# /etc/cron.daily/backup-eduhub-files

BACKUP_DIR="/backup/files"
DATE=$(date +%Y%m%d)
BACKUP_FILE="eduhub_files_${DATE}.tar.gz"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份上传文件
tar -czf "$BACKUP_DIR/$BACKUP_FILE" /var/www/eduhub/uploads

# 删除30天前的备份
find $BACKUP_DIR -name "eduhub_files_*.tar.gz" -mtime +30 -delete
```

## 故障处理

### 1. 常见问题
1. 服务无法启动
   - 检查端口占用: `netstat -tulpn | grep 3001`
   - 检查日志: `pm2 logs`
   - 检查环境变量: `cat .env.production`

2. 数据库连接失败
   - 检查数据库服务: `systemctl status mysql`
   - 检查连接配置: `cat .env.production | grep DB_`
   - 检查防火墙: `sudo ufw status`

3. 上传失败
   - 检查目录权限: `ls -la /var/www/eduhub/uploads`
   - 检查磁盘空间: `df -h`
   - 检查文件大小限制: `cat .env.production | grep MAX_FILE_SIZE`

### 2. 性能优化
1. 数据库优化
   - 添加索引
   - 优化查询
   - 定期维护

2. 缓存配置
   - 配置Redis缓存
   - 设置页面缓存
   - 优化静态资源缓存

3. 负载均衡
   - 配置多进程
   - 设置负载均衡
   - 优化资源分配 