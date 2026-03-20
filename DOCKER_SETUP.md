# Docker Setup - Livealoe Catalog

## Requisitos

- Docker Desktop instalado
- Docker Compose (incluído no Docker Desktop)

## Primeiros Passos

### 1. Estrutura do Projeto

```
livealoe-catalog/
├── docker-compose.yml
├── Dockerfile (Frontend)
├── nginx.conf
├── .dockerignore
├── .env.docker
├── package.json
├── server/
│   ├── Dockerfile (Backend)
│   ├── .dockerignore
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── google-credentials.json (opcional)
│   ├── data/
│   │   └── products.json
│   └── config/
│       └── google-drive-config.js
```

### 2. Configuração Pré-Docker

Certifique-se de que:
- `server/.env` existe com `GOOGLE_DRIVE_FOLDER_ID`
- `server/google-credentials.json` existe (se usar Google Drive)
- `server/data/products.json` existe

### 3. Iniciar com Docker Compose

#### Opção A: Build e Run (Primeira vez ou após mudanças)

```bash
cd livealoe-catalog
docker-compose up --build
```

#### Opção B: Run sem rebuild

```bash
docker-compose up
```

#### Opção C: Run em background

```bash
docker-compose up -d
```

### 4. Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## Comandos Úteis

### Parar os containers

```bash
docker-compose down
```

### Remover volumes (limpar dados)

```bash
docker-compose down -v
```

### Ver logs do backend

```bash
docker-compose logs backend
```

### Ver logs do frontend

```bash
docker-compose logs frontend
```

### Logs em tempo real

```bash
docker-compose logs -f
```

### Executar comando dentro do container

```bash
# Backend
docker-compose exec backend ls -la /app

# Frontend
docker-compose exec frontend curl http://localhost:5173/health
```

### Rebuild após mudanças no código

```bash
docker-compose up --build
```

## Volumes e Dados

### Uploads Persistentes

Os arquivos de upload são salvos em um Docker Volume chamado `uploads_data`:

```bash
# Ver volumes
docker volume ls | grep livealoe

# Inspecionar volume
docker volume inspect livealoe-catalog_uploads_data
```

### Dados de Produtos

O arquivo `server/data/products.json` é sincronizado com o container via volume bind.

### Credenciais Google Drive

O arquivo `server/google-credentials.json` é montado como read-only no container.

## Configuração de Ambiente

### Variáveis Docker (.env.docker)

```env
NODE_ENV=production
PORT=3001
GOOGLE_DRIVE_FOLDER_ID=suas_credenciais_aqui
```

### Backend (.env local)

```env
PORT=3001
NODE_ENV=development
GOOGLE_DRIVE_FOLDER_ID=seus_credenciais
```

## Network

Os serviços se comunicam através da network `livealoe-network`:

- **Backend**: Accessible como `http://backend:3001`
- **Frontend**: Accessible como `http://frontend:5173`

## Health Checks

Ambos os serviços possuem health checks:

- Backend: Verifica `/api/health` a cada 30s
- Frontend: Verifica `/health` a cada 30s

## Troubleshooting

### Porta já em uso

```bash
# Linux/Mac
sudo lsof -i :5173
sudo lsof -i :3001

# Windows
netstat -ano | findstr :5173
netstat -ano | findstr :3001
```

### Container não inicia

```bash
# Ver logs
docker-compose logs backend
docker-compose logs frontend

# Rebuildaer
docker-compose up --build --force-recreate
```

### Erro de conexão entre frontend e backend

Verifique se:
1. Backend está rodando e saudável: `docker-compose ps`
2. Network está correta: `docker network ls`
3. URL do backend no frontend aponta para `http://backend:3001`

### Limpar tudo e começar do zero

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Performance

### Otimizações aplicadas

1. **Multi-stage build** (Frontend): Reduz tamanho da imagem
2. **Alpine Linux**: Base menor que ubuntu
3. **Cache de layer Docker**: Dependências instaladas antes do código
4. **Nginx gzip**: Compressão de respostas
5. **Health checks**: Garante que serviços estão prontos

### Tamanho das imagens

```bash
docker images | grep livealoe
```

Esperado:
- Backend: ~400-500MB
- Frontend: ~100-150MB (com nginx)

## Deploy em Produção

Para produção, considere:

1. **Environment variables seguras**: Use `.env.production`
2. **HTTPS**: Adicione certificado SSL ao nginx
3. **Backup de volumes**: Implemente política de backup
4. **Recursos**: Configure limits de CPU/Memory no `docker-compose.yml`
5. **Logging**: Centralize logs (ELK, Datadog, etc)

### Exemplo com recursos limitados

```yaml
services:
  backend:
    # ... outras configs ...
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Monitoramento

```bash
# Ver estatísticas dos containers
docker stats

# Ver processes dentro de container
docker-compose top backend
```

## Documentação Referência

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Nginx Docker](https://hub.docker.com/_/nginx)
- [Node Docker](https://hub.docker.com/_/node)

---

**Última Atualização**: 2026-03-20
