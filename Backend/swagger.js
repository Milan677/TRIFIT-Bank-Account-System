const swaggerJsdoc=require("swagger-jsdoc");
const swaggerUi=require("swagger-ui-express");

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trifit-Banking-System',
      description: "API endpoints for a Banking application documented on Swagger",
      contact: {
        name: "Kamlesh Das",
        email: "daskamlesh677@gmail.com",
        url: ""
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:4567/",
        description: "Local server"
      },
      {
        url: "https://trifit-bank-account-system.onrender.com",
        description: "Live server"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, indicates the format of the token
        }
      }
    },
    
  },
  apis: ['./Routers/user.router.js'], // Path to your API documentation
};

  const swaggerSpec = swaggerJsdoc(options);

  module.exports=swaggerSpec;
