const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');

// Caminho para o arquivo de credenciais
const credentialsPath = path.join(__dirname, '../google-credentials.json');

let drive = null;

/**
 * Inicializa a conexão com Google Drive
 * Requer arquivo google-credentials.json com credenciais da Service Account
 */
function initializeDrive() {
  try {
    if (!fs.existsSync(credentialsPath)) {
      console.warn('⚠️  Arquivo google-credentials.json não encontrado!');
      console.warn('Para usar Google Drive:');
      console.warn('1. Acesse: https://console.cloud.google.com/');
      console.warn('2. Crie um Service Account e baixe o JSON');
      console.warn('3. Salve como: server/google-credentials.json');
      return false;
    }

    const credentials = require(credentialsPath);
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    drive = google.drive({
      version: 'v3',
      auth: auth,
    });

    console.log('✓ Google Drive conectado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao conectar Google Drive:', error.message);
    return false;
  }
}

/**
 * Faz upload de arquivo para Google Drive
 * @param {Buffer} fileBuffer - Conteúdo do arquivo
 * @param {string} fileName - Nome do arquivo
 * @param {string} folderId - ID da pasta no Google Drive (opcional)
 * @returns {Promise<string>} URL pública do arquivo
 */
async function uploadToGoogleDrive(fileBuffer, fileName, folderId = null) {
  try {
    if (!drive) {
      throw new Error('Google Drive não está inicializado. Configure google-credentials.json');
    }

    console.log('Iniciando upload:', { fileName, bufferSize: fileBuffer.length, folderId });

    // Preparar metadados do arquivo
    const fileMetadata = {
      name: fileName,
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    // Detectar MIME type correto
    const ext = fileName.toLowerCase().split('.').pop();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    const mimeType = mimeTypes[ext] || 'image/jpeg';
    console.log('MIME type detection:', { ext, mimeType });

    // Upload do arquivo
    console.log('Enviando para Google Drive API...');
    
    // Converter Buffer para Stream
    const bufferStream = Readable.from(fileBuffer);
    
    const response = await drive.files.create({
      resource: fileMetadata,
      media: {
        mimeType: mimeType,
        body: bufferStream,
      },
      fields: 'id, webViewLink, mimeType, size',
    });

    const fileId = response.data.id;
    console.log('Upload sucesso! File ID:', fileId, 'Tamanho:', response.data.size);

    // Tornar o arquivo compartilhável publicamente
    console.log('Configurando permissões públicas...');
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    console.log('Permissões configuradas.');

    // Construir URL de visualização direta
    const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    console.log('URL pública gerada:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload para Google Drive:', error.message);
    console.error('Detalhes:', error.response?.data || error);
    throw error;
  }
}

/**
 * Cria uma pasta no Google Drive
 * @param {string} folderName - Nome da pasta
 * @returns {Promise<string>} ID da folder criada
 */
async function createFolder(folderName) {
  try {
    if (!drive) {
      throw new Error('Google Drive não está inicializado');
    }

    const response = await drive.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });

    const folderId = response.data.id;

    // Tornar a pasta compartilhável
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return folderId;
  } catch (error) {
    console.error('Erro ao criar pasta no Google Drive:', error.message);
    throw error;
  }
}

/**
 * Deleta um arquivo do Google Drive
 * @param {string} fileId - ID do arquivo
 */
async function deleteFromGoogleDrive(fileId) {
  try {
    if (!drive) {
      throw new Error('Google Drive não está inicializado');
    }

    // Extrair ID da URL se for necessário
    const id = fileId.includes('id=') ? 
      fileId.split('id=')[1] : fileId;

    await drive.files.delete({
      fileId: id,
    });

    return true;
  } catch (error) {
    console.error('Erro ao deletar arquivo do Google Drive:', error.message);
    return false;
  }
}

module.exports = {
  initializeDrive,
  uploadToGoogleDrive,
  createFolder,
  deleteFromGoogleDrive,
};
