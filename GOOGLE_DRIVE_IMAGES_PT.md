# 🚀 Armazenamento de Imagens em Google Drive

## O que foi implementado?

Agora você pode armazenar as imagens dos produtos diretamente no **Google Drive** em vez de salvar localmente. Isso significa:

✅ As imagens ficarão **permanentemente** na nuvem  
✅ Funcionará em **qualquer dispositivo** (celular, tablet, desktop)  
✅ Acesso de **qualquer lugar** do mundo  
✅ Sem necessidade de pagar por servidor  
✅ **Backup automático** do Google Drive  

## Como Configurar em 5 Passos

### 1️⃣ Criar um Projeto no Google Cloud Console

- Acesse: https://console.cloud.google.com/
- Clique em "Criar Projeto" e nomeie como "Livealoe"
- Aguarde a criação...

### 2️⃣ Habilitar a Google Drive API

No console:
1. Vá em "APIs e Serviços"
2. Clique "Habilitar APIs e Serviços"
3. Pesquise por **"Google Drive API"**
4. Clique em **"Habilitar"**

### 3️⃣ Criar Service Account

Ainda no console:
1. Vá em "APIs e Serviços" → "Credenciais"
2. Clique "Criar Credenciais" → "Service Account"
3. Preencha:
   - Nome: `Livealoe Service`
   - Descrição: `Serviço de upload de imagens`
4. Clique "Continuar" e depois "Concluir"

### 4️⃣ Gerar a Chave JSON

1. Clique na Service Account criada
2. Vá para a aba **"Chaves"**
3. Clique "Adicionar chave" → "Nova chave"
4. Selecione **"JSON"** e clique "Criar"
5. Um arquivo `xxx.json` será baixado

**Salve este arquivo em:**
```
livealoe-catalog/server/google-credentials.json
```

### 5️⃣ Criar a Pasta no Google Drive

1. Acesse Google Drive: https://drive.google.com/
2. Crie uma nova pasta, ex: "Livealoe Products"
3. Copie o `email` do arquivo JSON (procure por `"client_email"`)
4. Compartilhe a pasta com esse email (permissão de Editor)
5. Copie o ID da pasta da URL:
   ```
   https://drive.google.com/drive/folders/AQUI_ESTA_O_ID/u/0/
   ```

### 6️⃣ Editar o .env

Na pasta `livealoe-catalog/server/`, edite o arquivo `.env`:

```bash
PORT=3001
GOOGLE_DRIVE_FOLDER_ID=seu_id_pasta_aqui
```

Palte o ID que copiou anteriormente.

## Pronto! 🎉

Agora:
1. Reinicie o servidor (`node server.js`)
2. Vá para http://localhost:5173 (ou seu IP remoto)
3. Crie um novo produto e faça upload de uma imagem
4. A imagem será automaticamente salva no Google Drive!

## O que Aparece no Console?

Quando o servidor inicia:
```
✓ Armazenamento de imagens: Google Drive
```

Se houver erro:
```
⚠️  Armazenamento de imagens: Local (/uploads)
```

## Testando Upload

1. Vá para **http://seu-ip:5173/admin**
2. Clique em "Novo Produto"
3. Selecione uma imagem
4. Clique "Salvar"
5. Verifique que a imagem aparece
6. Acesse o Google Drive - a imagem estará lá!

## Troubleshooting

### ❌ "Google Drive não está inicializado"
- Verifique se o arquivo está em `server/google-credentials.json`
- Verifique se a extensão é `.json` (não `.txt`)
- Reinicie o servidor

### ❌ Imagens não aparecem
- Verifique o console do navegador (F12)
- Certifique-se de que a pasta foi compartilhada com o email da Service Account
- Verifique se tem permissão de Editor (não só Visualizador)

### ❌ Upload toma muito tempo
- Google Drive pode ser mais lento que armazenamento local
- Limite a imagens até 5MB
- Tente novamente

## Diferenças: Local vs Google Drive

| Recurso | Local (/uploads) | Google Drive |
|---------|------------------|-------------|
| Velocidade | Rápido | Médio |
| Permanência | Depende do servidor | ✅ Permanente |
| Acesso | Mesmo IP | 🌍 Qualquer lugar |
| Backup | Manual | ✅ Automático |
| Limite | Disco do computador | 15GB grátis |
| Compartilhamento | Difícil | ✅ Fácil |

## Integração com Seu Celular

Se acessar via IP remoto (ex: http://192.168.1.69:5173):
- ✅ Imagens vão direto para Google Drive
- ✅ Funcionará perfeito em 4G/5G
- ✅ Nenhuma imagem fica "presa" no computador

## Próximas Ideias

- [ ] Sincronizar pasta Livealoe do Drive automaticamente
- [ ] Organizar por categorias em subpastas
- [ ] Adicionar miniaturas automáticas
- [ ] Backup em tempo real

---

**Dúvidas?** Revise o arquivo `GOOGLE_DRIVE_SETUP.md` na pasta `server/` para instruções mais detalhadas.
