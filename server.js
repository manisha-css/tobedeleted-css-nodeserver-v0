const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const i18n = require('./src/shared/i18n');
const logger = require('./src/shared/logger');
const httplogger = require('./src/shared/httplogger');
const swaggerDocument = require('./config/swagger.json');
const apiRoutes = require('./src/routes/index');
const InfoResponse = require('./src/shared/inforesponse');

const server = express();

// allow options
server.options('*', cors());
const whitelist = process.env.CORS_WHITELIST.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin
    // (like server to server or curl requests)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  exposedHeaders: ['Authorization']
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

// attach main api routes
server.use('/api', apiRoutes);

// handle 404
server.use((req, res) => {
  res.status(404).json({ message: `Route${req.url} Not found.` });
});

// below needs to be at the end of all
server.use((error, req, res, next) => {
  // Any request to this server will get here, and will send an HTTP
  logger.error(`Generic Error: ${error.message}`);
  const infoResponse = new InfoResponse(res.translate('general.error') + error.message);
  res.status(500).json(infoResponse);
  next(error);
});

server.listen(process.env.PORT, () => {
  logger.info(`Node App started on port: ${process.env.PORT}`);
});
