#!/bin/bash

# 设置错误时退出
set -e

# 项目根目录
PROJECT_ROOT="/home/EduHub"

# 前端目录结构
echo "Creating frontend directory structure..."
FRONTEND_DIRS=(
    "frontend/src/api"
    "frontend/src/assets"
    "frontend/src/components"
    "frontend/src/layouts"
    "frontend/src/router"
    "frontend/src/stores"
    "frontend/src/styles"
    "frontend/src/types"
    "frontend/src/views"
    "frontend/tests"
)

# 后端目录结构
echo "Creating backend directory structure..."
BACKEND_DIRS=(
    "backend/src/controllers"
    "backend/src/models"
    "backend/src/routes"
    "backend/src/services"
    "backend/src/utils"
    "backend/tests"
)

# 配置目录结构
echo "Creating config directory structure..."
CONFIG_DIRS=(
    "config/nginx"
    "docs"
    "scripts"
)

# 创建目录函数
create_directories() {
    local base_dir="$1"
    shift
    local dirs=("$@")
    
    for dir in "${dirs[@]}"; do
        full_path="${base_dir}/${dir}"
        if [ ! -d "$full_path" ]; then
            echo "Creating directory: $full_path"
            mkdir -p "$full_path"
        else
            echo "Directory already exists: $full_path"
        fi
    done
}

# 创建所有目录
cd "$PROJECT_ROOT"
create_directories "$PROJECT_ROOT" "${FRONTEND_DIRS[@]}"
create_directories "$PROJECT_ROOT" "${BACKEND_DIRS[@]}"
create_directories "$PROJECT_ROOT" "${CONFIG_DIRS[@]}"

# 创建必要的配置文件占位符
touch frontend/.gitkeep
touch backend/.gitkeep
touch config/nginx/.gitkeep

echo "Directory structure created successfully!"

# 显示目录结构
if command -v tree &> /dev/null; then
    tree -L 3
else
    find . -maxdepth 3 -type d
fi 