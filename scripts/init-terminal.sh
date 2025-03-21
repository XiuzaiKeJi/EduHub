#!/bin/bash

# 设置错误时退出
set -e

echo "开始配置终端环境..."

# 1. 安装 zsh（如果尚未安装）
if ! command -v zsh &> /dev/null; then
    echo "安装 zsh..."
    apt update
    apt install -y zsh
fi

# 2. 备份现有的 zsh 配置（如果存在）
if [ -f ~/.zshrc ]; then
    echo "备份现有 zsh 配置..."
    cp ~/.zshrc ~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)
fi

# 3. 安装 Oh My Zsh
if [ ! -d ~/.oh-my-zsh ]; then
    echo "安装 Oh My Zsh..."
    export RUNZSH=no
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# 4. 安装常用插件
echo "安装插件..."
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# 5. 配置 zsh
echo "配置 zsh..."
cat > ~/.zshrc << 'EOL'
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"

plugins=(
    git
    docker
    docker-compose
    zsh-autosuggestions
    zsh-syntax-highlighting
)

source $ZSH/oh-my-zsh.sh

# 设置时区
export TZ=Asia/Shanghai

# 设置语言环境
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# 设置编辑器
export EDITOR='vim'

# 设置历史记录
HISTSIZE=10000
SAVEHIST=10000
EOL

# 6. 设置 zsh 为默认 shell
echo "设置 zsh 为默认 shell..."
chsh -s $(which zsh)

echo "终端环境配置完成！"
echo "请重新启动终端或执行 'source ~/.zshrc' 使配置生效。" 