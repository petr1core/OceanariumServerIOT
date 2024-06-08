const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ocean.db'); // или укажите путь к файлу, если хотите постоянную БД

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        login TEXT NOT NULL,
        password TEXT NOT NULL,
        telephone TEXT NOT NULL
    )`);

    // Вставляем тестового пользователя
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const testPassword = 'password123';

    bcrypt.hash(testPassword, saltRounds, (err, hash) => {
        if (err) throw err;
        db.run(`INSERT INTO users (login, password, telephone) VALUES (?, ?, ?)`,
            ['testuser', hash, '8000-000-0000']);
    });
});

module.exports = db;