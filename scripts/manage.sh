#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 定义目录和文件
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/backend"
FRONTEND_DIR="${PROJECT_ROOT}/frontend"
TMP_DIR="${PROJECT_ROOT}/tmp"
BACKEND_PID_FILE="${TMP_DIR}/backend.pid"
FRONTEND_PID_FILE="${TMP_DIR}/frontend.pid"
LOG_DIR="${PROJECT_ROOT}/logs"
BACKEND_LOG="${LOG_DIR}/backend.log"
FRONTEND_LOG="${LOG_DIR}/frontend.log"

# 创建必要的目录
mkdir -p "${TMP_DIR}" "${LOG_DIR}"

# 错误处理
handle_error() {
    local exit_code=$?
    echo -e "${RED}错误: $1${NC}"
    exit $exit_code
}

# 检查目录是否存在
check_directory() {
    local dir=$1
    if [ ! -d "$dir" ]; then
        handle_error "目录 $dir 不存在"
    fi
}

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -i ":$port" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# 清理端口
clean_port() {
    local port=$1
    if check_port "$port"; then
        echo -e "${YELLOW}端口 $port 被占用，正在清理...${NC}"
        sudo fuser -k "$port/tcp" > /dev/null 2>&1
        sleep 1
    fi
}

# 停止服务
stop_service() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            echo -e "${YELLOW}正在停止 $service_name 服务 (PID: $pid)...${NC}"
            kill -15 "$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null
        fi
        rm -f "$pid_file"
    fi
    
    # 清理可能的僵尸进程
    pkill -f "$service_name" > /dev/null 2>&1
}

# 检查服务健康状态
check_health() {
    local service_type=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    echo -n "检查 $service_type 服务健康状态"
    while [ $attempt -le $max_attempts ]; do
        if [ "$service_type" = "backend" ]; then
            if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
                echo -e "\n${GREEN}$service_type 服务已就绪${NC}"
                return 0
            fi
        elif [ "$service_type" = "frontend" ]; then
            if curl -s -f "http://localhost:$port" > /dev/null 2>&1; then
                echo -e "\n${GREEN}$service_type 服务已就绪${NC}"
                return 0
            fi
        fi
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo -e "\n${RED}$service_type 服务启动超时${NC}"
    show_logs "$service_type" "${LOG_DIR}/${service_type}.log" 20
    return 1
}

# 启动服务
start_service() {
    local service_type=$1
    local port=$2
    local retry_count=0
    local max_retries=3
    
    while [ $retry_count -lt $max_retries ]; do
        if [ "$service_type" = "backend" ]; then
            check_directory "$BACKEND_DIR"
            clean_port "$port"
            
            cd "$BACKEND_DIR" || handle_error "无法进入后端目录"
            echo -e "${GREEN}启动后端服务 (尝试 $((retry_count + 1))/$max_retries)...${NC}"
            NODE_ENV=development pnpm dev > "$BACKEND_LOG" 2>&1 &
            echo $! > "$BACKEND_PID_FILE"
            cd "$PROJECT_ROOT" || handle_error "无法返回项目根目录"
            
            if check_health "backend" "$port"; then
                return 0
            fi
            
            stop_service "$BACKEND_PID_FILE" "backend"
            echo -e "${YELLOW}尝试修复并重新启动...${NC}"
            
            # 尝试修复常见问题
            cd "$BACKEND_DIR" || handle_error "无法进入后端目录"
            pnpm install > /dev/null 2>&1
            cd "$PROJECT_ROOT" || handle_error "无法返回项目根目录"
            
        elif [ "$service_type" = "frontend" ]; then
            check_directory "$FRONTEND_DIR"
            clean_port "$port"
            
            cd "$FRONTEND_DIR" || handle_error "无法进入前端目录"
            echo -e "${GREEN}启动前端服务 (尝试 $((retry_count + 1))/$max_retries)...${NC}"
            NODE_ENV=development pnpm dev > "$FRONTEND_LOG" 2>&1 &
            echo $! > "$FRONTEND_PID_FILE"
            cd "$PROJECT_ROOT" || handle_error "无法返回项目根目录"
            
            if check_health "frontend" "$port"; then
                return 0
            fi
            
            stop_service "$FRONTEND_PID_FILE" "frontend"
            echo -e "${YELLOW}尝试修复并重新启动...${NC}"
            
            # 尝试修复常见问题
            cd "$FRONTEND_DIR" || handle_error "无法进入前端目录"
            pnpm install > /dev/null 2>&1
            cd "$PROJECT_ROOT" || handle_error "无法返回项目根目录"
        fi
        
        retry_count=$((retry_count + 1))
        if [ $retry_count -lt $max_retries ]; then
            echo -e "${YELLOW}等待5秒后重试...${NC}"
            sleep 5
        fi
    done
    
    echo -e "${RED}服务 $service_type 启动失败，已达到最大重试次数${NC}"
    show_logs "$service_type" "${LOG_DIR}/${service_type}.log" 50
    return 1
}

# 显示日志
show_logs() {
    local service_type=$1
    local log_file=$2
    local lines=${3:-50}
    
    if [ -f "$log_file" ]; then
        echo -e "${YELLOW}最近的 $service_type 日志:${NC}"
        tail -n "$lines" "$log_file"
    fi
}

# 主命令处理
case "$1" in
    start)
        echo -e "${GREEN}启动所有服务...${NC}"
        start_service "backend" 8080
        start_service "frontend" 5173
        sleep 2
        show_logs "后端" "$BACKEND_LOG" 10
        show_logs "前端" "$FRONTEND_LOG" 10
        ;;
        
    stop)
        echo -e "${RED}停止所有服务...${NC}"
        stop_service "$BACKEND_PID_FILE" "backend"
        stop_service "$FRONTEND_PID_FILE" "frontend"
        ;;
        
    restart)
        echo -e "${GREEN}重启所有服务...${NC}"
        $0 stop
        sleep 2
        $0 start
        ;;
        
    status)
        echo "检查服务状态..."
        if [ -f "$BACKEND_PID_FILE" ] && ps -p $(cat "$BACKEND_PID_FILE" 2>/dev/null) > /dev/null 2>&1; then
            echo -e "${GREEN}后端服务正在运行 (PID: $(cat $BACKEND_PID_FILE))${NC}"
            show_logs "后端" "$BACKEND_LOG" 5
        else
            echo -e "${RED}后端服务未运行${NC}"
        fi
        
        if [ -f "$FRONTEND_PID_FILE" ] && ps -p $(cat "$FRONTEND_PID_FILE" 2>/dev/null) > /dev/null 2>&1; then
            echo -e "${GREEN}前端服务正在运行 (PID: $(cat $FRONTEND_PID_FILE))${NC}"
            show_logs "前端" "$FRONTEND_LOG" 5
        else
            echo -e "${RED}前端服务未运行${NC}"
        fi
        ;;
        
    logs)
        show_logs "后端" "$BACKEND_LOG" 100
        echo
        show_logs "前端" "$FRONTEND_LOG" 100
        ;;
        
    *)
        echo "使用方法: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac

exit 0 