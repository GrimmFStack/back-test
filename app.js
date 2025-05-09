const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); // Para ver logs de peticiones en consola
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Muestra detalles de peticiones HTTP en consola

// Importar rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const brandRoutes = require('./routes/brands');
const logRoutes = require('./routes/logs'); // 👈 Solo si implementaste el paso 16

// Montar rutas
app.use('/api/auth', authRoutes);       // Autenticación (login/register)
app.use('/api/products', productRoutes); // CRUD de productos
app.use('/api/brands', brandRoutes);     // CRUD de marcas
app.use('/api/logs', logRoutes);         // 🔍 Opcional: logs (paso 16)

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando 🚀',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      brands: '/api/brands'
    }
  });
});

// Manejo de errores (personalizado)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal 💥' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.listen(PORT, () => {
  console.log(`✅ Servidor listo en http://localhost:${PORT}`);
});