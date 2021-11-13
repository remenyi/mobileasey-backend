const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
          title: "Mobileasey Express API with Swagger",
          version: "0.1.0",
          description:
          "Leasing application made with Express and documented with Swagger",
          license: {
              name: "MIT",
              url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Reményi Gergely",
                email: "remenyig@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ["./routes/default_routes.js"]
};

const specs = swaggerJsdoc(options);

module.exports = function(app){app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {explorer: true}));};

