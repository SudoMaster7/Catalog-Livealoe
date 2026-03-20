# Frontend Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código
COPY . .

# Build da aplicação
RUN npm run build

# Stage de produção com nginx
FROM nginx:alpine

# Copiar configuração nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos buildados
COPY --from=build /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 5173

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
