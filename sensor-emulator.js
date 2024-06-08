const axios = require('axios');

// Функция для генерации случайных данных датчика
function generateSensorData(sensorId) {
    const temperature = Math.random() * 50;
    const humidity = Math.random() * 100;
    const data = {
        sensorId: sensorId,
        temperature: temperature.toFixed(2),
        humidity: humidity.toFixed(2),
        timestamp: new Date().toISOString()
    };
    return data;
}

// Функция для отправки данных на сервер
function sendDataToServer(sensorId) {
    const data = generateSensorData(sensorId);
    console.log(`Sensor ${sensorId}: Sending data:`, data);

    axios.post('http://localhost:3000/sensor-data', data)
        .then(response => {
            console.log(`Sensor ${sensorId}: Response status code: ${response.status}`);
            console.log(`Sensor ${sensorId}: Response body:`, response.data);
        })
        .catch(error => {
            console.error(`Sensor ${sensorId}: Error sending data:`, error.message);
        });
}

// Функция для создания и запуска датчика с заданным интервалом
function startSensor(sensorId, interval) {
    setInterval(() => sendDataToServer(sensorId), interval);
}

// Запуск нескольких датчиков с разными интервалами
startSensor('sensor1', 10000); // Датчик 1 отправляет данные каждые 10 секунд
startSensor('sensor2', 5000);  // Д
