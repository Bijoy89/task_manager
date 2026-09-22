const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimiter);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;