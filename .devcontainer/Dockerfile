FROM node:18

# 安装基本工具
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /workspace

# 设置用户
USER node

# 设置环境变量
ENV NODE_ENV=development 