const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PhlexiBIT AI Task Delegation API',
    version: '1.0.0',
    description: 'API documentation for AI Task Delegation System',
    contact: {
      name: 'Soni Marmik',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{
    BearerAuth: []
  }]
};

const options = {
  swaggerDefinition,
  apis: ['./modules/*/*.js', './modules/*/*/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
