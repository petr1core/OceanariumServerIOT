const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
const PORT = 3000;

let sensorData = { // изменим на let чтобы можно было модифицировать
    // sensor1: { type: 'temperature', status: 'on', value: 25.5, timestamp: '2022-01-01 12:00:00' },
    // sensor2: { type: 'salinity', status: 'on', value: 22.3, timestamp: '2022-01-01 12:05:00' }
};

// Middleware для парсинга JSON тел запросов
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Обслуживание статических файлов (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Обработка GET-запросов для получения данных сенсоров
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'reg.html'));
});

app.get('/sensor-data', (req, res) => {
    res.json(sensorData);
});

app.get('/dash', (req, res)=>{
    res.sendFile(path.join(__dirname, 'test.html'));
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

app.post('/dash', (req, res) => {
    res.redirect('/');
});

app.post('/log-out', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login.html'))
})

app.post('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, 'reg.html'))
});

app.post('/registered', (req, res) => {
    res.redirect('/dash');
});

// app.post('/sensor-data', (req, res) => {
//     const data = req.body;
//     if (data && data.sensorId && sensorData[data.sensorId]) {
//         sensorData[data.sensorId] = {
//             type: data.type,
//             status: sensorData[data.sensorId].status,
//             value: data.value,
//             timestamp: data.timestamp
//         };
//         res.json({ status: 'success' });
//     } else {
//         res.status(400).json({ status: 'error', message: 'Invalid data or sensor ID' });
//     }
// });

// // Новый маршрут для создания датчика
// app.post('/create-sensor', (req, res) => {
//     const { type, status } = req.body;
//     const sensorId = `sensor${Object.keys(sensorData).length + 1}`;
//     sensorData[sensorId] = {
//         type,
//         status,
//         value: '--',
//         timestamp: new Date().toISOString()
//     };
//     res.json({ sensorId, ...sensorData[sensorId] });
// });
app.post('/create-sensor', (req, res) => {
    const { type, status } = req.body;
    db.run(`INSERT INTO sensors (sens_type, sens_status) VALUES (?, ?)`, [type, status], function(err) {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
        const sensorId = this.lastID;
        sensorData[sensorId] = { type, status, value: 0, timestamp: new Date().toISOString() };
        res.json({ sensorId, type, status });
    });
});

app.post('/sensor-data', (req, res) => {
    const { sensorId, type, value, timestamp } = req.body;
    if (sensorId && type && value !== undefined && timestamp) {
        if (!sensorData[sensorId]) {
            sensorData[sensorId] = { type, status: 'off', value: 0, timestamp: '' };
        }
        // Проверка статуса датчика перед обновлением данных
        if (sensorData[sensorId].status === 'on') {
            sensorData[sensorId].value = value;
            sensorData[sensorId].timestamp = timestamp;

            let tableName;
            switch (type) {
                case 'temperature':
                    tableName = 'temperature_log';
                    break;
                case 'salinity':
                    tableName = 'salinity_log';
                    break;
                case 'luminance':
                    tableName = 'luminance_log';
                    break;
                default:
                    return res.status(400).json({ status: 'error', message: 'Invalid sensor type' });
            }

            db.run(`INSERT INTO ${tableName} (${type}_value, timestamp) VALUES (?, ?)`, [value, timestamp], (err) => {
                if (err) {
                    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
                }
                res.json({ status: 'success' });
            });
        } else {
            res.json({ status: 'skipped', message: 'Sensor is off, no data recorded' });
        }
    } else {
        res.status(400).json({ status: 'error', message: 'Invalid data or sensor ID' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
