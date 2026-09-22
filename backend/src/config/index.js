require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port:parseInt(process.env.PORT, 10) || 3000,
    dbPath: process.env.DB_PATH || './data/tasks.db',
    corsOrigin:process.env.CORS_ORIGIN || 'http://localhost:3000',
    rateLimit:{
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, 
        max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200, 
    },
}