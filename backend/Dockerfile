FROM node:18-alpine

WORKDIR /app

# 安装基础工具
RUN apk add --no-cache \
    git \
    curl \
    python3 \
    make \
    g++ \
    sqlite

# 设置时区
ENV TZ=Asia/Shanghai
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

# 设置语言环境
ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8

# 安装 pnpm
RUN npm install -g pnpm

# 配置 pnpm
RUN pnpm config set store-dir /root/.local/share/pnpm/store

# 创建数据和缓存目录
RUN mkdir -p /app/data /root/.local/share/pnpm/store

# 设置开发端口
EXPOSE 3001 9229

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:3001/health || exit 1

# 启动命令（在 docker-compose.yml 中指定）
CMD ["sh", "-c", "pnpm install && pnpm start:dev"] 