# 🚀 Deploy Backend no Render - Instruções Rápidas

## Passo 1: Criar Conta no Render
1. Acesse https://render.com
2. Clique "Get Started"
3. Selecione "Continue with GitHub"
4. Autorize acesso aos seus repositórios

## Passo 2: Criar Web Service
1. Na dashboard do Render, clique "New +" → "Web Service"
2. Selecione: **Catalog-Livealoe** (seu repositório)
3. Configure:
   - **Name**: `livealoe-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `node server/server.js`
   - **Instance Type**: `Free` ✅

4. Clique "Create Web Service"

## Passo 3: Aguardar Deploy
- Render rodará o build (~2-3 minutos)
- Quando terminar, verá: `https://livealoe-backend.onrender.com`
- Copie essa URL!

## Passo 4: Testar Backend
No navegador, abra:
```
https://livealoe-backend.onrender.com/api/health
```

Deve retornar JSON ✅

## Passo 5: Atualizar Frontend

Abra `src/main.jsx` e procure por:
```javascript
http://localhost:3001
```

Substitua por:
```javascript
https://livealoe-backend.onrender.com
```

## Passo 6: Fazer Push
```powershell
cd "c:\Users\leosc\OneDrive\Área de Trabalho\Livealoe\livealoe-catalog"
git add .
git commit -m "Configure backend for Render deploy"
git push
```

## ✅ Pronto!

Seus sites estão ao vivo:
- **Frontend**: https://livealoe-catalog.vercel.app
- **Backend**: https://livealoe-backend.onrender.com ✅

---

**Nota**: No Render Free, o servidor hibernará após 15 min. Clique no site para acordá-lo (leva até 30 segundos).

Para remover esse limite, upgrade para plano pago.

**Dúvidas?** Veja RENDER_DEPLOYMENT.md para guia completo.
