# Configuração do Google Drive para Armazenamento de Imagens

## Passo 1: Criar uma Service Account no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto (ex: "Livealoe Catalog")
3. Habilite a Google Drive API:
   - Clique em "APIs e Serviços"
   - Clique em "Habilitar APIs e Serviços"
   - Pesquise por "Google Drive API"
   - Clique em "Habilitar"

4. Crie uma Service Account:
   - Vá para "APIs e Serviços" → "Credenciais"
   - Clique em "Criar Credenciais" → "Service Account"
   - Preenchao formulário:
     * Nome: "Livealoe Catalog Service"
     * Descrição: "Serviço para upload de imagens de produtos"
     * Clique "Continuar"
   - Na próxima tela, pule os passos opcionais e clique "Concluir"

## Passo 2: Gerar a Chave JSON

1. Clique na Service Account criada
2. Vá para a aba "Chaves"
3. Clique "Adicionar chave" → "Nova chave"
4. Selecione "JSON" e clique "Criar"
5. Um arquivo JSON será baixado automaticamente

## Passo 3: Configurar no Projeto

1. Copie o arquivo JSON baixado
2. Cole na pasta do servidor como: `server/google-credentials.json`
3. O arquivo deve parecer assim:
   ```json
   {
     "type": "service_account",
     "project_id": "seu-projeto-id",
     "private_key_id": "...",
     "private_key": "...",
     "client_email": "...",
     "client_id": "...",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "...",
     "client_x509_cert_url": "..."
   }
   ```

## Passo 4: Criar uma Pasta no Google Drive

1. Acesse seu Google Drive: https://drive.google.com/
2. Crie uma nova pasta chamada "Livealoe Products"
3. Clique com botão direito na pasta → "Compartilhar"
4. Cole o email da Service Account (encontrado no arquivo JSON como "client_email")
5. Dê permissão de "Editor"
6. Copie o ID da pasta da URL:
   - URL: `https://drive.google.com/drive/folders/PASTA_ID_AQUI`
   - Copie o `PASTA_ID_AQUI`

## Passo 5: Salvar o ID da Pasta

Adicione no arquivo `.env`:
```
GOOGLE_DRIVE_FOLDER_ID=seu_pasta_id_aqui
```

## Pronto!

Agora o sistema de upload de imagens vai:
✓ Fazer upload automáticamente para Google Drive
✓ Gerar URLs públicas e compartilháveis
✓ Armazenar as URLs nos produtos
✓ Funcionará em qualquer dispositivo/localização

## Como Funciona

- Quando você cria/edita um produto e faz upload de uma imagem:
  1. A imagem é enviada para Google Drive
  2. O sistema gera uma URL pública
  3. A UUID é salva no JSON dos produtos
  4. Você pode acessar de qualquer lugar

## Troubleshooting

Se receber erro "Google Drive não está inicializado":
- Verifique se o arquivo `google-credentials.json` está em `server/`
- Verifique se a API do Google Drive está habilitada
- Reinicie o servidor com `node server.js`

Se as imagens não aparecerem:
- Verifique se o caminho das imagens começa com `https://drive.google.com/`
- Tente compartilhar a pasta do Google Drive novamente
- Verifique as permissões da Service Account
