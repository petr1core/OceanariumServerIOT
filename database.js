// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ocean.db'); // или укажите путь к файлу, если хотите постоянную БД

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        login TEXT NOT NULL,
        password TEXT NOT NULL,
        telephone TEXT NOT NULL
    )`);

    // заметь, мы раскомментировали этот код, 
    // теперь база данных расширилась ещё на несколько таблиц,
    // они нужны чтобы хранить информацию о датчиках

    db.run(`CREATE TABLE IF NOT EXISTS sensors (
        sensor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        sens_type TEXT NOT NULL,
        sens_status TEXT NOT NULL
      )`);
    
    // Создание таблиц логов для каждого типа датчика
    db.run(`CREATE TABLE IF NOT EXISTS temperature_log (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        temperature_value REAL NOT NULL,
        timestamp TEXT NOT NULL
    )`);
      
    db.run(`CREATE TABLE IF NOT EXISTS salinity_log (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        salinity_value REAL NOT NULL,
        timestamp TEXT NOT NULL
    )`);
      
    db.run(`CREATE TABLE IF NOT EXISTS luminance_log (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        luminance_value REAL NOT NULL,
        timestamp TEXT NOT NULL
    )`);
});

module.exports = db;