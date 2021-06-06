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
    host: process.env.NODE_ENV === 'production' ? 'ecommerce-elonaire.herokuapp.com' : 'localhost:3000',
    schemes: ['http', 'https']
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./app.js')
});
