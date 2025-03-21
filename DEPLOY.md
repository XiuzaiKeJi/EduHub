# EduHub 生产环境部署指南

本文档详细说明了如何将 EduHub 项目部署到生产环境。

## 目录
- [前置条件](#前置条件)
- [代码部署](#代码部署)
- [环境配置](#环境配置)
- [服务启动](#服务启动)
- [域名配置](#域名配置)
- [监控和维护](#监控和维护)
- [备份策略](#备份策略)
- [回滚策略](#回滚策略)

## 前置条件

### 系统要求
- Ubuntu 20.04 LTS 或更高版本
- Docker 20.10 或更高版本
- Docker Compose 2.0 或更高版本
- Node.js 18.x（如果需要本地构建）
- Nginx（如果需要反向代理）

### 端口要求
- 80 (HTTP)
- 443 (HTTPS)
- 3001 (API服务)

### 存储要求
- 系统盘：至少 20GB 可用空间
- 数据盘：建议 50GB 或更大（用于数据和备份）

## 代码部署

### 1. 从 GitHub 克隆代码
```bash
# 克隆代码
git clone https://github.com/your-username/eduhub.git
cd eduhub

# 切换到生产分支
git checkout main
```

### 2. 环境准备
```bash
# 安装 Docker 和 Docker Compose
apt update
apt install -y docker.io docker-compose

# 启动 Docker 服务
systemctl start docker
systemctl enable docker

# 创建必要的目录
mkdir -p data logs backup
```

## 环境配置

### 1. 配置环境变量
```bash
# 复制环境变量示例文件
cp .env.example .env.production

# 编辑生产环境配置
vim .env.production
```

### 2. 敏感信息处理
- 所有敏感信息（密码、密钥等）都应该在 `.env.production` 中配置
- 严禁将包含真实密码/密钥的 .env 文件提交到代码仓库
- 推荐使用密码管理工具或云平台的密钥管理服务

## 服务启动

### 1. 构建和启动服务
```bash
# 构建并启动所有服务
docker-compose -f docker-compose.prod.yml up -d --build

# 查看服务状态
docker-compose -f docker-compose.prod.yml ps

# 查看服务日志
docker-compose -f docker-compose.prod.yml logs -f
```

### 2. 验证部署
- 访问前端：https://your-domain.com
- 测试API：https://api.your-domain.com/api/v1/health
- 检查日志：/home/eduhub/logs/

## 域名配置

### 1. SSL证书配置
```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d your-domain.com -d api.your-domain.com
```

### 2. Nginx配置
- 前端服务：将 80/443 端口流量转发到前端容器
- API服务：将 api.your-domain.com 的流量转发到后端容器

## 监控和维护

### 1. 日志管理
```bash
# 设置日志轮转
cat > /etc/logrotate.d/eduhub << EOF
/home/eduhub/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF
```

### 2. 监控配置
- 配置服务器监控（CPU、内存、磁盘使用率）
- 设置容器健康检查
- 配置告警通知（邮件/短信）

## 备份策略

### 1. 数据备份
```bash
# 创建备份脚本
cat > /root/backup.sh << EOF
#!/bin/bash
backup_dir="/backup/eduhub/\$(date +%Y%m)"
mkdir -p "\$backup_dir"
timestamp=\$(date +%Y%m%d_%H%M%S)

# 备份数据
tar -zcvf "\$backup_dir/data_\$timestamp.tar.gz" /home/eduhub/data/

# 保留最近30天的备份
find /backup/eduhub -type f -mtime +30 -delete
EOF

# 设置执行权限
chmod +x /root/backup.sh

# 添加到计划任务
echo "0 2 * * * /root/backup.sh" >> /var/spool/cron/crontabs/root
```

### 2. 配置备份
- 定期备份环境变量文件
- 备份 Nginx 配置
- 备份 SSL 证书

## 回滚策略

### 1. 代码回滚
```bash
# 回滚到指定版本
git checkout <commit-hash>
docker-compose -f docker-compose.prod.yml up -d --build
```

### 2. 数据回滚
```bash
# 停止服务
docker-compose -f docker-compose.prod.yml down

# 恢复数据
tar -zxvf /backup/eduhub/data_<timestamp>.tar.gz -C /home/eduhub/

# 重启服务
docker-compose -f docker-compose.prod.yml up -d
```

## 常见问题

### 1. 服务无法启动
- 检查环境变量配置
- 检查端口占用情况
- 查看 Docker 日志

### 2. 数据库连接失败
- 检查数据库文件权限
- 确认数据目录已正确挂载
- 检查数据库配置

### 3. 证书问题
- 检查证书有效期
- 确认证书路径配置
- 更新 SSL 证书

## 联系支持

如果遇到无法解决的问题，请联系：
- 技术支持邮箱：support@example.com
- 项目负责人：maintainer@example.com 