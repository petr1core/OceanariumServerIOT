const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
const PORT = 3000;

const sensorData = { // так и оставлю на всякий
    sensor1: { temperature: 25.5, humidity: 60, timestamp: '2022-01-01 12:00:00' },
    sensor2: { temperature: 22.3, humidity: 55, timestamp: '2022-01-01 12:05:00' }
};

// Middleware для парсинга JSON тел запросов
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Обслуживание статических файлов (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Обработка GET-запросов для получения данных сенсоров
// Обработка запросов на главный HTML файл
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'reg.html'));
});

app.get('/sensor-data', (req, res) => {
    res.json(sensorData);
});

app.get('/dash', (req, res)=>{
    res.sendFile(path.join(__dirname, 'Dash.html'));
});

// Обработка данных формы регистрации
app.post('/register', (req, res) => {
    const { login, password, phone } = req.body;

    db.get('SELECT * FROM users WHERE login = ?', [login], (err, user) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        if (user) {
            return res.status(400).send('User already exists');
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }

            db.run(`INSERT INTO users (login, password, telephone) VALUES (?, ?, ?)`,
                [login, hashedPassword, phone], (err) => {
                    if (err) {
                        return res.status(500).send('Internal Server Error');
                    }
                    res.redirect('/dash');
                });
        });
    });
});

// Обработка данных формы входа
app.post('/login', (req, res) => {
    const { login, password } = req.body;
    db.get('SELECT * FROM users WHERE login = ?', [login], (err, user) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        if (!user) {
            console.log('notuser');
            return res.status(401).send('Invalid login credentials');
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                res.redirect('/dash');
            } else {
                res.status(401).send('Invalid login credentials');
            }
        });
    });
});

// Обработка данных формы регистрации
app.post('/dash', (req, res) => {
    //const { login, password, phone } = req.body;
    //тут может быть дополнительная валидация
    // Если данные валидны, перенаправляем на index.html
    res.redirect('/');
});

app.post('/log-out', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login.html'))
})

app.post('/sign-up', (req, res) => { // Маршрут для формы регистрации

    res.sendFile(path.join(__dirname, 'reg.html'))
});



app.post('/registered', (req, res) => { // Маршрут для формы регистрации
    res.redirect('/dash');
});


// Обработка POST-запросов для обновления данных сенсоров
app.post('/sensor-data', (req, res) => {
    const data = req.body;
    if (data && data.sensorId && sensorData[data.sensorId]) {
        sensorData[data.sensorId] = {
            temperature: data.temperature,
            humidity: data.humidity,
            timestamp: data.timestamp
        };
        res.json({ status: 'success' });
    } else {
        res.status(400).json({ status: 'error', message: 'Invalid data or sensor ID' });
    }
});  



app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
