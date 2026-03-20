# Livealoe - Catálogo de Fitocosméticos

Plataforma de e-commerce para catálogo de produtos Livealoe desenvolvida em React + Vite no frontend e Node.js + Express no backend, com suporte a Docker.

## Características

✅ **Frontend (React + Vite)**
- Interface responsiva com Vite
- Multilíngue (Português, Inglês, Francês)
- Catálogo de produtos com filtros
- Carrinho de compras
- Painel administrativo

✅ **Backend (Node.js + Express)**
- API RESTful completa
- Upload de imagens com Multer
- Armazenamento local de uploads
- CORS habilitado
- Google Drive integration (para credenciais)

✅ **Docker**
- Containerização do backend e frontend
- Docker Compose para orquestração
- Nginx como proxy reverso
- Health checks automáticos

## Requisitos

- **Desenvolvimento Local**: Node.js 20+, npm
- **Docker**: Docker Desktop com Docker Compose

## Instalação e Uso

### Opção 1: Desenvolvimento Local

#### Backend
```bash
cd server
npm install
npm start
```
Servidor rodando em `http://localhost:3001`

#### Frontend
```bash
npm install
npm run dev
```
Aplicação rodando em `http://localhost:5173`

### Opção 2: Docker (Recomendado)

```bash
# Build e inicia containers
docker-compose up --build

# Ou apenas inicia se já foi buildado
docker-compose up

# Em background
docker-compose up -d
```

**Acessar:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/api/health

## Estrutura do Projeto

```
livealoe-catalog/
├── docker-compose.yml          # Orquestração Docker
├── Dockerfile                  # Build frontend (Nginx)
├── nginx.conf                  # Configuração Nginx
├── public/
│   └── uploads/               # Armazenamento de imagens
├── src/
│   ├── components/            # Componentes React
│   ├── pages/                 # Páginas (Home, Admin, etc)
│   ├── context/               # Context API
│   ├── styles/                # Estilos CSS
│   └── App.jsx
├── server/
│   ├── Dockerfile             # Build backend
│   ├── server.js              # Express principal
│   ├── package.json
│   ├── data/
│   │   └── products.json      # Banco de dados produtos
│   └── config/
│       └── google-drive-config.js
├── DOCKER_SETUP.md            # Guia Docker detalhado
└── README.md
```

## Endpoints da API

### Produtos
- `GET /api/products` - Listar todos
- `POST /api/products` - Criar novo
- `PUT /api/products/:id` - Atualizar
- `DELETE /api/products/:id` - Deletar
- `GET /api/categories` - Listar categorias
- `GET /api/price-range` - Faixa de preços

### Upload
- `POST /api/upload` - Upload de imagem

### Health
- `GET /api/health` - Status da API

## Variáveis de Ambiente

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
GOOGLE_DRIVE_FOLDER_ID=seu_folder_id
```

### Docker (.env.docker)
```env
NODE_ENV=production
PORT=3001
GOOGLE_DRIVE_FOLDER_ID=seu_folder_id
```

## Recursos

### Catálogo
- Visualizar produtos com filtros
- Buscar por nome/categoria
- Adicionar ao carrinho
- Modal de detalhes completo

### Admin
- Criar/editar/deletar produtos
- Upload de imagens
- Gerenciar categorias
- Campos: nome, preço, ingredientes, descrição, tags

### Imagens
- Upload via formulário
- Armazenamento em `public/uploads/`
- Fallback para imagem padrão
- Suporte: JPG, PNG, GIF, WebP
- Limite: 10MB por arquivo

## Docker Compose

### Serviços
- **backend**: Node.js + Express (porta 3001)
- **frontend**: Nginx + SPA React (porta 5173)

### Volumes
- `./public/uploads/`: Persist uploads do backend
- `./server/data/`: Persist banco de dados JSON
- `./server/google-credentials.json`: Credenciais (read-only)

### Network
- `livealoe-network`: Comunicação entre containers

## Comandos Úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs do backend
docker-compose logs -f backend

# Ver logs do frontend
docker-compose logs -f frontend

# Parar containers
docker-compose stop

# Remover containers
docker-compose down

# Limpar volumes (CUIDADO: perde dados)
docker-compose down -v

# Build apenas
docker-compose build

# Rebuild sem cache
docker-compose build --no-cache

# Executar comando no container
docker-compose exec backend ls /app
```

## Troubleshooting

### Porta já em uso
```bash
# Windows
netstat -ano | findstr :5173
netstat -ano | findstr :3001

# Linux/Mac
lsof -i :5173
lsof -i :3001
```

### Imagens não aparecem no Admin
- Verificar se o error handler está ativo (crossOrigin="anonymous")
- Verificar logs: `docker-compose logs backend`
- Testar upload com arquivo pequeno (<1MB)

### Containers não começam
```bash
# Rebuild com força
docker-compose up --build --force-recreate

# Mostrar logs detalhados
docker-compose logs -f

# Limpar e recomeçar
docker-compose down -v
docker-compose up --build
```

### Google Drive não conecta
- Verificar arquivo `server/google-credentials.json`
- Service Account sem quota? Usar armazenamento local
- Ver logs: `docker-compose logs backend | grep "Google Drive"`

## Deploy em Produção

### Checklist
- [ ] Environment variables seguras (.env.production)
- [ ] HTTPS configurado no Nginx
- [ ] Backup de volumes
- [ ] Limites de recursos (CPU/Memory)
- [ ] Monitoramento de logs
- [ ] Health checks
- [ ] Rate limiting na API

### Exemplo docker-compose.prod.yml
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

## Tecnologias

### Frontend
- React 19
- Vite 8
- React Router 7
- i18next (Multilíngue)
- Zustand (State)
- Axios (HTTP)

### Backend
- Node.js 20
- Express 4
- Multer (Upload)
- Sharp (Imagens)
- CORS
- Dotenv

### DevOps
- Docker
- Docker Compose
- Nginx
- Alpine Linux

## Licença

Proprietary - Livealoe

## Suporte

Para sugestões ou problemas, abra uma issue no repositório.

---

**Última Atualização**: Março 2026
