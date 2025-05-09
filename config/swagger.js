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
        url: 'https://back-test-63v5.onrender.com/api',
        description: 'Producción',
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Local',
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
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
