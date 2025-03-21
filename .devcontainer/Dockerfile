FROM node:20-slim

# 安装基本工具
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 创建非 root 用户
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# 设置工作目录
WORKDIR /workspace

# 切换到非 root 用户
USER $USERNAME

# 设置 npm 配置
RUN npm config set prefix '~/.npm-global'
ENV PATH=~/.npm-global/bin:$PATH

# 安装全局包
RUN npm install -g npm@latest 