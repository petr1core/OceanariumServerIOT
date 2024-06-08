// Функция для обновления данных датчика в реальном времени
function updateSensorData(sensorId, temperature, humidity, timestamp) {
    document.getElementById(`temp${sensorId}`).textContent = temperature;
    document.getElementById(`humid${sensorId}`).textContent = humidity;
    document.getElementById(`time${sensorId}`).textContent = timestamp;
}

// Функция для получения данных датчиков с сервера
function fetchSensorData() {
    fetch('http://localhost:3000/sensor-data')
        .then(response => response.json())
        .then(data => {
            updateSensorData('1', data.sensor1.temperature, data.sensor1.humidity, data.sensor1.timestamp);
            updateSensorData('2', data.sensor2.temperature, data.sensor2.humidity, data.sensor2.timestamp);
        })
        .catch(error => console.error('Ошибка при получении данных сенсора:', error));
}

// Установить интервал для периодического опроса сервера (каждые 5 секунд)
setInterval(fetchSensorData, 1500);

// Первоначальный запрос для немедленного заполнения данных
fetchSensorData();
