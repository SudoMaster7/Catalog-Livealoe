# Deploy Backend no Render - Guia Completo

## 📋 Pré-requisitos
- Conta GitHub (já tem ✅)
- Repositório do projeto no GitHub (já tem ✅)
- Conta Render (criar em https://render.com)

## 🚀 Passo a Passo

### 1. **Criar Conta no Render**
1. Acesse https://render.com
2. Clique em "Get Started" (ou faça login se já tem conta)
3. Selecione "Continue with GitHub"
4. Autorize o Render a acessar seus repositórios

### 2. **Configurar Backend para Render**

O Render precisa saber como rodar seu backend. Vamos criar/verificar:

#### A. Arquivo `server/.env.render` (opcional mas recomendado)
```env
NODE_ENV=production
PORT=3001
```

#### B. Atualizar `server/server.js` para ouvir em `0.0.0.0`
Verifique se sua linha de listen está assim:
```javascript
app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3001}`)
})
```

### 3. **Criar Web Service no Render**

1. Acesse https://dashboard.render.com
2. Clique em **"New +"** → **"Web Service"**
3. Selecione seu repositório GitHub: `Catalog-Livealoe`
4. Configure:

| Campo | Valor |
|-------|-------|
| **Name** | `livealoe-backend` |
| **Environment** | `Node` |
| **Build Command** | `cd server && npm install` |
| **Start Command** | `node server/server.js` |
| **Instance Type** | `Free` (ou pago se quiser) |

5. Clique em **"Create Web Service"**

### 4. **Esperar Deploy**

- Render começará a fazer build (~2-3 minutos)
- Você verá logs em tempo real
- Quando terminar, verá: "Your service is live at: https://livealoe-backend.onrender.com"

### 5. **Testar API**

Abra no navegador:
```
https://livealoe-backend.onrender.com/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2026-03-20T10:30:00.000Z"
}
```

### 6. **Atualizar Frontend com URL do Backend**

Após deploy bem-sucedido, você precisa atualizar o frontend para chamar a API correta.

**Arquivo: `src/main.jsx`** (ou criar arquivo `.env`)

Busque por:
```javascript
http://localhost:3001
```

E mude para:
```javascript
https://livealoe-backend.onrender.com
```

Ou crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=https://livealoe-backend.onrender.com
```

### 7. **Fazer Push com Atualizações**

```powershell
cd "c:\Users\leosc\OneDrive\Área de Trabalho\Livealoe\livealoe-catalog"
git add .
git commit -m "Update: configure backend for Render deployment"
git push
```

## ✅ Checklist Final

- [ ] Conta Render criada
- [ ] Repositório conectado ao Render
- [ ] Web Service criado
- [ ] Build passou sem erros
- [ ] API respondendo (health check)
- [ ] Frontend atualizado com URL do backend
- [ ] Push feito no GitHub
- [ ] Vercel detectou e está fazendo redeploy
- [ ] Frontend + Backend funcionando juntos

## 🔗 URLs Finais

```
✅ Frontend:  https://livealoe-catalog.vercel.app
✅ Backend:   https://livealoe-backend.onrender.com
✅ API:       https://livealoe-backend.onrender.com/api/products
```

## 🆘 Troubleshooting

### Erro: "Cannot find module 'express'"
- Verifique se `server/package.json` existe e tem dependências
- Render rodará: `npm install` automaticamente

### Erro: "Port already in use"
- Render gerencia portas automaticamente
- Use `process.env.PORT` ou deixe Express escolher

### API retorna 404
- Verifique se você está usando a URL correta
- Teste: `https://seu-dominio.onrender.com/api/health`

### Imagens não carregam
- URLs das imagens devem ser completas: `https://seu-backend.onrender.com/uploads/...`
- Ou configure uploads em S3/Cloudinary

### Servidor dorme (Free tier)
- Render coloca projetos gratuitos em sleep após 15 min sem atividade
- Acessar novamente acorda o servidor (leva até 30 segundos)
- Solução: upgrade para plano pago

## 💡 Dicas

1. **Free vs Paid**
   - Free: ideal para testes/demo
   - Pago: produção, sem sleep, mais recursos

2. **Variáveis de Ambiente**
   - No Render, vá para "Environment" na Settings
   - Adicione `GOOGLE_DRIVE_FOLDER_ID` se usar Google Drive

3. **Logs**
   - Acesse em "Logs" na dashboard do Render
   - Use `console.log()` para debug

4. **Redeploy**
   - Automático a cada push no GitHub
   - Ou manual em "Deployments"

## 📱 Próximos Passos

1. Deploy do backend (este guia) ✅
2. Testar URLs
3. Configurar uploads (S3 para produção)
4. Adicionar mongoose/MongoDB se quiser banco relacional
5. Domínio customizado (opcional)

---

**Dúvidas? Veja a documentação oficial**: https://render.com/docs
