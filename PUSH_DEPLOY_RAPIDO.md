# 🚀 Push e Deploy - Instruções Rápidas

## 1️⃣ Criar Repositório GitHub

1. Acesse https://github.com/new
2. Nome: `livealoe-catalog`
3. Descrição: "Catálogo e-commerce Livealoe com React + Node.js"
4. Deixe público
5. Clique em "Create repository"
6. **Copie a URL** do seu repositório

## 2️⃣ Fazer Push para GitHub

Cole estes comandos no PowerShell (substitua `SEU_USUARIO`):

```powershell
cd "c:\Users\leosc\OneDrive\Área de Trabalho\Livealoe\livealoe-catalog"

git remote add origin https://github.com/SEU_USUARIO/livealoe-catalog.git
git branch -M main
git push -u origin main
```

## 3️⃣ Deploy na Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New" → "Project"
3. Selecione "Import Git Repository"
4. Cole: `https://github.com/SEU_USUARIO/livealoe-catalog.git`
5. Clique "Import"
6. Na aba "Environment Variables", adicione:
   ```
   VITE_API_URL=http://localhost:3001
   ```
7. Clique "Deploy"
8. Aguarde o build terminar (2-3 minutos)
9. Acesse seu projeto em `https://livealoe-catalog.vercel.app` ✅

## 4️⃣ Deploy do Backend

**Recomendação: Usar Render ou Heroku**

### Opção A: Render (mais simples)
1. Acesse https://render.com/
2. Clique "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - Build command: `cd server && npm install`
   - Start command: `node server/server.js`
   - Port: `3001`
5. Deploy

### Opção B: Heroku
1. Acesse https://www.heroku.com/
2. Crie um novo app "livealoe-backend"
3. Em "Deploy", selecione GitHub
4. Configure deploy automático

## 5️⃣ Atualizar Frontend com URL do Backend

Após fazer deploy do backend, atualize:

**Arquivo: `src/main.jsx`** ou **`env` file**

```javascript
// Mudar de:
http://localhost:3001

// Para:
https://seu-backend.herokuapp.com  // ou render
```

## ✅ Pronto!

- Frontend: `https://livealoe-catalog.vercel.app` 
- Backend: `https://sua-api.herokuapp.com`
- Banco de dados: `./server/data/products.json` (ou migrar para MongoDB)

---

**Dúvidas?** Veja `VERCEL_DEPLOYMENT.md` para instruções detalhadas.
