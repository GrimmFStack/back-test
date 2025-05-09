const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Productos y Marcas',
      version: '1.0.0',
      description: 'Documentación de la API con autenticación JWT y CRUD',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'], // Ruta a tus archivos de rutas
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;