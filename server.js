const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const i18n = require('./src/shared/i18n');

const logger = require('./src/shared/logger');
const httplogger = require('./src/shared/httplogger');
const swaggerDocument = require('./swagger.json');
const userRoutes = require('./src/routes/user.routes');
const errorHandler = require('./src/shared/error-handler');

const server = express();

// allow options
server.options('*', cors());
const whitelist = ['http://localhost:4200/en', 'http://localhost:4300/fr'];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
server.use(cors(corsOptions));

// i18n init
server.use(i18n.init);

// swagger docs
const router = express.Router();
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use('/api/v1', router);

// body parser
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// below will add to winston httplogger
server.use(morgan('combined', { stream: httplogger.stream }));

server.get(
  '/',
  errorHandler.wrapAsync(async (req, res) => {
    const greeting = 'HelloWorld';
    res.send(res.translate(greeting));
  })
);

server.get(
  '/healthcheck',
  errorHandler.wrapAsync(async (req, res) => {
    res.json({
      message: 'Healthcheck is successfull'
    });
  })
);

userRoutes.userRoutes(server);

// below needs to be at the end of all routes
server.use((error, req, res, next) => {
  res.json({ message: error.message });
  // pass it to express to handle it
  next(error);
});

server.listen(process.env.PORT, () => {
  logger.info(`Node App started on port: ${process.env.PORT}`);
});
