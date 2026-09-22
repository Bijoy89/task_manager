const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`Task Manager API running on port ${config.port} [${config.env}]`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});