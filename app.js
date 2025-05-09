const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'https://tu-api.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true
}));
// =============================================
// Configuración de CORS (Personalizada para producción)
// =============================================
const corsOptions = {
  origin: [
    'https://tu-api.onrender.com',          // Dominio en Render
    'http://localhost:3000',                // Desarrollo local
    'https://tu-api.onrender.com/api-docs'  // Swagger UI
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));  // 👈 Usa las opciones personalizadas

// =============================================
// Middlewares básicos
// =============================================
app.use(express.json());
app.use(morgan('dev'));

// =============================================
// Importación de rutas
// =============================================
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const brandRoutes = require('./routes/brands');
const logRoutes = require('./routes/logs');

// =============================================
// Montaje de rutas
// =============================================
app.use('/api/auth', authRoutes);       // 👈 Prefijo consistente
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/logs', logRoutes);

// =============================================
// Swagger UI (Documentación)
// =============================================
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Redirección de raíz a Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// =============================================
// Manejo de errores
// =============================================
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// =============================================
// Inicio del servidor
// =============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor listo en:\n- Local: http://localhost:${PORT}\n- Render: https://tu-api.onrender.com`);
  console.log(`📚 Documentación: http://localhost:${PORT}/api-docs`);
});