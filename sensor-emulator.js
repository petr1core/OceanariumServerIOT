const axios = require('axios');

function generateSensorData(sensorId, type) {
  let value;
  switch (type) {
    case 'temperature':
      value = (Math.random() * 50).toFixed(2);
      break;
    case 'salinity':
      value = (Math.random() * 100).toFixed(2);
      break;
    case 'luminance':
      value = (Math.random() * 1000).toFixed(2);
      break;
    default:
      value = 0;
  }
  const data = {
    sensorId: sensorId,
    type: type,
    value: value,
    timestamp: new Date().toISOString()
  };
  return data;
}

function sendDataToServer(sensorId, type) {
  const data = generateSensorData(sensorId, type);
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

function startSensor(sensorId, type, interval) {
  setInterval(() => sendDataToServer(sensorId, type), interval);
}

//startSensor('1', 'temperature', 10000);
//startSensor('2', 'salinity', 5000);
//startSensor('3', 'luminance', 15000);
