const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

// Importar Google Drive config
const { initializeDrive, uploadToGoogleDrive } = require('./config/google-drive-config');

// Importar dados
let products = require('./data/products.json');
let driveEnabled = false;

const app = express();
const PORT = process.env.PORT || 3001;
const productsFilePath = path.join(__dirname, './data/products.json');
const uploadsDir = path.join(__dirname, '../public/uploads');

// Criar pasta de uploads se não existir
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer para upload de imagens com diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `product_${timestamp}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    
    if (mime && ext) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPG, PNG, GIF, WebP)'));
    }
  }
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Função para salvar produtos no arquivo
const saveProducts = () => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Livealoe Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      priceRange: '/api/price-range',
      upload: 'POST /api/upload'
    }
  });
});

// API root
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Livealoe API v1',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'API running successfully', 
    timestamp: new Date().toISOString(),
    googleDriveEnabled: driveEnabled,
    googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || 'NOT SET'
  });
});

// Função para transformar URLs dinâmicas de imagens
const transformProductImages = (product, req) => {
  const transformedProduct = { ...product };
  if (transformedProduct.image) {
    // Se é URL local com /uploads/, transformar para dinâmica
    if (transformedProduct.image.includes('/uploads/')) {
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:3001';
      transformedProduct.image = `${protocol}://${host}${transformedProduct.image}`;
    }
    // Se é URL do Google Drive, transformar para usar proxy (evita problemas de CORS)
    else if (transformedProduct.image.includes('drive.google.com')) {
      const fileIdMatch = transformedProduct.image.match(/id=([a-zA-Z0-9-_]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        const protocol = req.protocol || 'http';
        const host = req.get('host') || 'localhost:3001';
        transformedProduct.image = `${protocol}://${host}/api/image-proxy/${fileIdMatch[1]}`;
      }
    }
  }
  return transformedProduct;
};

// GET todos os produtos
app.get('/api/products', (req, res) => {
  const { category, maxPrice, minPrice, search } = req.query;
  let filtered = [...products];

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.ingredients.toLowerCase().includes(searchLower)
    );
  }

  // Transformar URLs de imagens para dinâmicas
  const transformedProducts = filtered.map(p => transformProductImages(p, req));

  res.json({
    total: transformedProducts.length,
    products: transformedProducts
  });
});

// GET produto por ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(transformProductImages(product, req));
});

// POST - Criar novo produto
app.post('/api/products', (req, res) => {
  try {
    const { name, category, price, ingredients, description, fullDescription, imageUrl, tags, inStock } = req.body;

    // Validação
    if (!name || !category || !price || !ingredients || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProduct = {
      id: `prod_${Date.now()}`,
      name,
      category,
      price: parseFloat(price),
      ingredients,
      description,
      fullDescription: fullDescription || '',
      image: imageUrl || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
      tags: Array.isArray(tags) ? tags : [],
      inStock: inStock !== undefined ? inStock : true,
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    saveProducts();

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Upload de imagem
app.post('/api/upload', (req, res, next) => {
  console.log('Upload request received');
  
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err.message);
      if (err.code === 'FILE_TOO_LARGE') {
        return res.status(400).json({ error: 'Arquivo muito grande (máx 10MB)' });
      }
      return res.status(400).json({ error: `Erro no upload: ${err.message}` });
    } else if (err) {
      console.error('Upload error:', err.message);
      return res.status(400).json({ error: err.message });
    }

    // Se chegou aqui, o arquivo foi enviado com sucesso
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    console.log('File uploaded to disk:', req.file.filename, 'Size:', req.file.size, 'bytes');

    try {
      // Google Drive está desabilitado por limitações de quota (Service Account)
      // Usar apenas armazenamento local por enquanto
      const imageUrl = `/uploads/${req.file.filename}`;
      
      return res.status(201).json({
        message: 'Image uploaded successfully',
        imageUrl: imageUrl,
        filename: req.file.originalname,
        storage: 'local'
      });
    } catch (err) {
      console.error('Upload error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  });
});

// PUT - Atualizar produto
app.put('/api/products/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { name, category, price, ingredients, description, fullDescription, imageUrl, tags, inStock } = req.body;

    // Atualizar campos fornecidos
    if (name) products[productIndex].name = name;
    if (category) products[productIndex].category = category;
    if (price) products[productIndex].price = parseFloat(price);
    if (ingredients) products[productIndex].ingredients = ingredients;
    if (description) products[productIndex].description = description;
    if (fullDescription !== undefined) products[productIndex].fullDescription = fullDescription || '';
    if (imageUrl) products[productIndex].image = imageUrl;
    if (tags) products[productIndex].tags = Array.isArray(tags) ? tags : [];
    if (inStock !== undefined) products[productIndex].inStock = inStock;

    products[productIndex].updatedAt = new Date().toISOString();

    saveProducts();

    res.json({
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Deletar produto
app.delete('/api/products/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products.splice(productIndex, 1);
    saveProducts();

    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Proxy de imagens do Google Drive (para evitar problemas de CORS)
app.get('/api/image-proxy/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const https = require('https');
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    https.get(url, (driveRes) => {
      // Definir headers apropriados
      res.setHeader('Content-Type', driveRes.headers['content-type']);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      // Permitir CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      driveRes.pipe(res);
    }).on('error', (err) => {
      console.error('Erro ao fazer proxy da imagem:', err);
      res.status(500).json({ error: 'Erro ao carregar imagem' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET categorias
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// GET preço máximo/mínimo
app.get('/api/price-range', (req, res) => {
  const prices = products.map(p => p.price);
  res.json({
    min: Math.min(...prices),
    max: Math.max(...prices)
  });
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// 404 handler
app.use((req, res) => {
  console.log('404 not found:', req.method, req.path);
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API health check: http://localhost:${PORT}/api/health`);

  // Tentar inicializar Google Drive
  driveEnabled = initializeDrive();
  if (driveEnabled) {
    console.log('✓ Armazenamento de imagens: Google Drive');
  } else {
    console.log('⚠️  Armazenamento de imagens: Local (/uploads)');
  }
});
