const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const sensorData = { // так и оставлю на всякий
    sensor1: { temperature: 25.5, humidity: 60, timestamp: '2022-01-01 12:00:00' },
    sensor2: { temperature: 22.3, humidity: 55, timestamp: '2022-01-01 12:05:00' }
};

// Middleware для парсинга JSON тел запросов
app.use(express.json());

// Обслуживание статических файлов (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Обработка GET-запросов для получения данных сенсоров
app.get('/sensor-data', (req, res) => {
    res.json(sensorData);
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

// Обработка запросов на главный HTML файл
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
