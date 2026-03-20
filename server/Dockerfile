# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar código da aplicação
COPY . .

# Criar diretório de uploads se não existir
RUN mkdir -p /app/public/uploads

# Expor porta
EXPOSE 3001

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3001

# Comando para iniciar
CMD ["node", "server.js"]
