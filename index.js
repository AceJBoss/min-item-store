const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const http = require('http');
const cors = require('cors');
const app = express();

// cors middleware
app.use(cors());

// body parser middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// swagger configuration
const swaggerDefinition = {
  info: {
    title: 'Stackoverflow Clone Swagger API',
    version: '1.0.0',
    description: 'Endpoints to test the routes',
  },
  host: 'localhost:5000',
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// api routes
let apiRoute = require('./routes/api');

app.use(apiRoute);


// set port
const port = process.env.PORT || 5000;

const server = http.createServer(app);

// start server
server.listen(port, function(){
	console.log(`Server started on port ${port}...`);
});

module.exports = app;