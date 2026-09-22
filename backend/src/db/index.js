const Database = require('better-sqlite3');
const config = require('../config');
const runMigrations = require('./migrate');

runMigrations();

const db = new Database(config.dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;