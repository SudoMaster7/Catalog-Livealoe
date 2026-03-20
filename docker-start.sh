#!/bin/bash

# Script para facilitar comandos Docker
# Uso: ./docker-start.sh [comando]

set -e

COMMANDS=(
    "build-all"
    "start"
    "stop"
    "restart"
    "logs"
    "logs-backend"
    "logs-frontend"
    "clean"
    "clean-volumes"
    "status"
    "shell-backend"
    "shell-frontend"
)

print_usage() {
    echo "Livealoe Docker Manager"
    echo "======================="
    echo ""
    echo "Uso: ./docker-start.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    for cmd in "${COMMANDS[@]}"; do
        echo "  - $cmd"
    done
    echo ""
}

if [ -z "$1" ]; then
    print_usage
    exit 1
fi

case "$1" in
    build-all)
        echo "🔨 Building Docker images..."
        docker-compose build
        echo "✅ Build completo!"
        ;;
    start)
        echo "🚀 Starting containers..."
        docker-compose up -d
        echo "✅ Containers iniciados!"
        echo "Frontend: http://localhost:5173"
        echo "Backend: http://localhost:3001"
        ;;
    stop)
        echo "⏹️  Stopping containers..."
        docker-compose stop
        echo "✅ Containers parados!"
        ;;
    restart)
        echo "🔄 Restarting containers..."
        docker-compose restart
        echo "✅ Containers reiniciados!"
        ;;
    logs)
        echo "📋 Showing all logs..."
        docker-compose logs -f
        ;;
    logs-backend)
        echo "📋 Backend logs..."
        docker-compose logs -f backend
        ;;
    logs-frontend)
        echo "📋 Frontend logs..."
        docker-compose logs -f frontend
        ;;
    status)
        echo "📊 Container status:"
        docker-compose ps
        ;;
    clean)
        echo "🧹 Cleaning containers..."
        docker-compose down
        echo "✅ Containers removidos!"
        ;;
    clean-volumes)
        echo "🗑️  Removing volumes (CUIDADO: dados serão perdidos)..."
        docker-compose down -v
        echo "✅ Volumes removidos!"
        ;;
    shell-backend)
        echo "📱 Connecting to backend shell..."
        docker-compose exec backend sh
        ;;
    shell-frontend)
        echo "📱 Connecting to frontend shell..."
        docker-compose exec frontend sh
        ;;
    *)
        echo "❌ Comando desconhecido: $1"
        print_usage
        exit 1
        ;;
esac
