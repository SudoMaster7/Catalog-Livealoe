# Guia de Deploy na Vercel - Livealoe

## 📋 Pré-requisitos
- Conta GitHub
- Conta Vercel (www.vercel.com)
- Repositório criado no GitHub

## 🚀 Passos para Deploy

### 1. **Criar Repositório no GitHub**
```bash
# Você precisa criar um repositório vazio no GitHub
# Depois adicionar o remote:
git remote add origin https://github.com/SEU_USUARIO/livealoe-catalog.git
git branch -M main
git push -u origin main
```

### 2. **Importar Projeto na Vercel**
1. Acesse https://vercel.com/dashboard
2. Clique em "Add New" → "Project"
3. Selecione "Import Git Repository"
4. Cole a URL do seu repositório GitHub
5. Clique em "Import"

### 3. **Configurar Variáveis de Ambiente**
1. Na página do projeto na Vercel, vá para "Settings" → "Environment Variables"
2. Adicione as variáveis necessárias:
   ```
   VITE_API_URL=http://localhost:3001 (ou URL do seu backend)
   ```
3. Salve as mudanças

### 4. **Deploy**
- Vercel fará deploy automático a cada push para `main`
- Você pode monitorar o progresso em "Deployments"

## ⚙️ Arquitetura do Deploy

### Frontend (React + Vite)
- Hospedado automaticamente na Vercel
- URL: `https://seu-projeto.vercel.app`
- Build automático de cada branch

### Backend (Node.js + Express)
**Opção 1: Vercel Serverless Functions**
- Coloque os arquivos do backend em `/api/`
- A Vercel converterá automaticamente em funções serverless

**Opção 2: Heroku/Render (Recomendado)**
- Backend em serviço separado
- Configure a URL do backend nas variáveis de ambiente do frontend
- Exemplo: `VITE_API_URL=https://seu-backend.herokuapp.com`

## 📝 Estrutura Atual
```
livealoe-catalog/
├── src/                 # Frontend React
├── server/              # Backend Express
├── vercel.json          # Configuração Vercel
└── package.json         # Dependências
```

## 🔄 Fluxo de Deploy
1. Faça push para GitHub: `git push origin main`
2. Vercel detecta automaticamente e inicia o build
3. Após sucesso, seu projeto está ao vivo
4. Acesse em `https://seu-projeto.vercel.app`

## ✅ Checklist Final
- [ ] Repositório criado no GitHub
- [ ] Push feito com todos os arquivos
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build passou sem erros
- [ ] URL do projeto funcionando
- [ ] Backend configurado (Heroku/Render/Vercel Functions)
- [ ] API conectando corretamente

## 🆘 Troubleshooting

### Erro: "Cannot find module 'express'"
- Verifique se o `server/package.json` está correto
- Vercel rodará `npm install && cd server && npm install` automaticamente

### Erro: API não conecta
- Configure a `VITE_API_URL` corretamente nas Environment Variables
- Certifique-se que o backend está rodando (teste em local primeiro)

### Erro: Imagens não carregam
- Verifique se as URLs das imagens estão usando `VITE_API_URL`
- Uploads precisam ser persistidos em banco ou storage externo (não local)

## 💡 Dicas
- Use `.vercelignore` para excluir arquivos do upload (similar a `.gitignore`)
- Configure webhooks para automatizar testes antes do deploy
- Use branches diferentes para staging/production
- Monitore logs em "Deployments" → "Build logs"

---
**Próximos passos**: Deploy backend em Heroku ou Render se ainda não tiver feito!
