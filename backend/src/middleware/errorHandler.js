const config = require('../config');

module.exports = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}]`, err);

  const status = err.status || 500;
  const message =
    status === 500 && config.env === 'production'
      ? 'Internal server error.'
      : err.message || 'Internal server error.';

  res.status(status).json({ error: message });
};