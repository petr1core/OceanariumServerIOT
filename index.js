// Function to update sensor data in real-time
function updateSensorData(sensorId, temperature, humidity, timestamp) {
    document.getElementById(`temp${sensorId}`).textContent = temperature;
    document.getElementById(`humid${sensorId}`).textContent = humidity;
    document.getElementById(`time${sensorId}`).textContent = timestamp;
}

// Example of updating sensor data (replace with actual data)
updateSensorData('1', '25.5', '60', '2022-01-01 12:00:00');
updateSensorData('2', '22.3', '55', '2022-01-01 12:05:00');