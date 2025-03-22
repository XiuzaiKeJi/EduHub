# EduHub 部署指南

本文档详细说明了如何在不同环境下部署 EduHub 项目。

## 目录

- [环境要求](#环境要求)
- [本地部署](#本地部署)
- [Docker 部署](#docker-部署)
- [生产环境部署](#生产环境部署)
- [CI/CD 配置](#cicd-配置)
- [监控和日志](#监控和日志)
- [备份和恢复](#备份和恢复)
- [故障排除](#故障排除)

## 环境要求

### 系统要求
- CPU: 2核或更高
- 内存: 4GB或更高
- 磁盘: 20GB或更高
- 操作系统: Ubuntu 20.04/22.04 LTS

### 软件要求
- Node.js 18.x 或更高版本
- pnpm 10.x 或更高版本
- Docker 24.x 或更高版本
- Docker Compose 2.x 或更高版本
- Nginx 1.20 或更高版本
- Git 2.x 或更高版本

## 本地部署

### 1. 克隆项目
```bash
git clone https://github.com/XiuzaiKeJi/EduHub.git
cd EduHub
```

### 2. 安装依赖
```bash
# 安装后端依赖
cd backend
pnpm install

# 安装前端依赖
cd ../frontend
pnpm install
```

### 3. 配置环境变量
```bash
# 后端配置
cp .env.example .env.production
# 编辑 .env.production 文件设置生产环境配置

# 前端配置
cd ../frontend
cp .env.example .env.production
# 编辑 .env.production 文件设置生产环境配置
```

### 4. 构建项目
```bash
# 构建后端
cd backend
pnpm build

# 构建前端
cd ../frontend
pnpm build
```

### 5. 启动服务
```bash
# 启动后端服务
cd backend
pnpm start

# 配置 Nginx 并启动前端服务
sudo cp nginx.conf /etc/nginx/conf.d/eduhub.conf
sudo nginx -t
sudo systemctl restart nginx
```

## Docker 部署

### 1. 开发环境

使用 Docker Compose 启动所有服务：

```bash
# 启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 2. 生产环境

使用生产环境配置文件启动服务：

```bash
# 创建外部网络
docker network create eduhub-network

# 启动服务
docker-compose -f docker-compose.prod.yml up -d

# 查看服务状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

## 生产环境部署

### 1. 服务器准备

```bash
# 更新系统
sudo apt update
sudo apt upgrade -y

# 安装必要软件
sudo apt install -y curl git nginx

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 安装 Docker
curl -fsSL https://get.docker.com | sh -
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. SSL 证书配置

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 证书自动续期
sudo systemctl enable certbot.timer
```

### 3. Nginx 配置

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS 配置
    add_header Strict-Transport-Security "max-age=63072000" always;

    # 前端文件
    location / {
        root /var/www/eduhub;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## CI/CD 配置

### GitHub Actions 配置

```yaml
name: Deploy

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
        version: 10

    - name: Build
      run: |
        pnpm install
        pnpm build

    - name: Deploy
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/eduhub
          git pull
          pnpm install
          pnpm build
          docker-compose -f docker-compose.prod.yml up -d --build
```

## 监控和日志

### 1. 日志配置

```bash
# 配置日志轮转
sudo nano /etc/logrotate.d/eduhub

/var/log/eduhub/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
```

### 2. 监控配置

使用 Prometheus 和 Grafana 进行监控：

```yaml
# docker-compose.prod.yml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=your_password
```

## 备份和恢复

### 1. 数据库备份

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/eduhub"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
cp /data/eduhub.db $BACKUP_DIR/eduhub_$DATE.db

# 压缩备份
tar -czf $BACKUP_DIR/eduhub_$DATE.tar.gz $BACKUP_DIR/eduhub_$DATE.db

# 删除30天前的备份
find $BACKUP_DIR -name "eduhub_*.tar.gz" -mtime +30 -delete
```

### 2. 自动备份配置

```bash
# 添加到 crontab
0 2 * * * /path/to/backup.sh
```

## 故障排除

### 1. 常见问题

1. 服务无法启动
   - 检查端口占用
   - 验证环境变量
   - 查看错误日志

2. 数据库连接失败
   - 检查数据库文件权限
   - 验证连接配置
   - 确认数据库服务状态

3. Nginx 配置问题
   - 检查配置文件语法
   - 验证SSL证书
   - 查看错误日志

### 2. 日志查看

```bash
# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 应用日志
tail -f /var/log/eduhub/app.log

# Docker 容器日志
docker-compose logs -f
```

### 3. 性能优化

1. Node.js 优化
   - 设置合适的内存限制
   - 启用压缩
   - 使用 PM2 进程管理

2. Nginx 优化
   - 启用缓存
   - 配置 Gzip
   - 优化工作进程

3. 数据库优化
   - 定期维护
   - 优化查询
   - 添加索引

## 联系支持

如果遇到无法解决的问题，请联系技术支持：

- 邮件：support@eduhub.com
- 文档：https://docs.eduhub.com
- 问题追踪：https://github.com/XiuzaiKeJi/EduHub/issues 