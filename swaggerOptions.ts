import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi API',
      version: '1.0.0',
      description: 'Documentación de mi API con Swagger',
    },
  },
  // Especifica la ubicación de tus archivos de tipo .ts
  apis: ['./**/*.ts'],
};

export default swaggerOptions;