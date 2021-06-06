const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './app.js'
];
const doc = {
    info: {
        title: 'E-commerce RESTful API',
        // description: 'Description',
    },
    schemes: ['http', 'https']
}

swaggerAutogen(outputFile, endpointsFiles, doc);
