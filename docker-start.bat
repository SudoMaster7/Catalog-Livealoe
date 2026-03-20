@echo off
REM Script para facilitar comandos Docker no Windows
REM Uso: docker-start.bat [comando]

setlocal enabledelayedexpansion

if "%1"=="" (
    call :print_usage
    exit /b 1
)

if "%1"=="build-all" (
    echo [*] Building Docker images...
    docker-compose build
    echo [✓] Build completo!
    exit /b 0
)

if "%1"=="start" (
    echo [*] Starting containers...
    docker-compose up -d
    echo [✓] Containers iniciados!
    echo.
    echo Frontend: http://localhost:5173
    echo Backend: http://localhost:3001
    exit /b 0
)

if "%1"=="stop" (
    echo [*] Stopping containers...
    docker-compose stop
    echo [✓] Containers parados!
    exit /b 0
)

if "%1"=="restart" (
    echo [*] Restarting containers...
    docker-compose restart
    echo [✓] Containers reiniciados!
    exit /b 0
)

if "%1"=="logs" (
    echo [*] Showing all logs...
    docker-compose logs -f
    exit /b 0
)

if "%1"=="logs-backend" (
    echo [*] Backend logs...
    docker-compose logs -f backend
    exit /b 0
)

if "%1"=="logs-frontend" (
    echo [*] Frontend logs...
    docker-compose logs -f frontend
    exit /b 0
)

if "%1"=="status" (
    echo [*] Container status:
    docker-compose ps
    exit /b 0
)

if "%1"=="clean" (
    echo [*] Cleaning containers...
    docker-compose down
    echo [✓] Containers removidos!
    exit /b 0
)

if "%1"=="clean-volumes" (
    echo [!] Removing volumes (CUIDADO: dados serão perdidos)...
    docker-compose down -v
    echo [✓] Volumes removidos!
    exit /b 0
)

if "%1"=="shell-backend" (
    echo [*] Connecting to backend shell...
    docker-compose exec backend sh
    exit /b 0
)

if "%1"=="shell-frontend" (
    echo [*] Connecting to frontend shell...
    docker-compose exec frontend sh
    exit /b 0
)

echo [x] Comando desconhecido: %1
call :print_usage
exit /b 1

:print_usage
    echo.
    echo Livealoe Docker Manager
    echo =======================
    echo.
    echo Uso: docker-start.bat [comando]
    echo.
    echo Comandos disponíveis:
    echo   - build-all          : Build das imagens Docker
    echo   - start              : Inicia os containers
    echo   - stop               : Para os containers
    echo   - restart            : Reinicia os containers
    echo   - logs               : Ver logs de tudo
    echo   - logs-backend       : Ver logs do backend
    echo   - logs-frontend      : Ver logs do frontend
    echo   - status             : Ver status dos containers
    echo   - clean              : Remove containers
    echo   - clean-volumes      : Remove containers e volumes
    echo   - shell-backend      : Acessa shell do backend
    echo   - shell-frontend     : Acessa shell do frontend
    echo.
    exit /b 0
