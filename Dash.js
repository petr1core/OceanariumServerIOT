document.addEventListener('DOMContentLoaded', () => {
  const sensorHolder = document.getElementById('sensor-holder');
  const createSensorButton = document.getElementById('create-sensor');
  const sensorIntervals = {}; // Хранение интервалов для каждого датчика

  async function fetchSensors() {
      try {
          const response = await fetch('/sensor-data');
          const data = await response.json();

          sensorHolder.innerHTML = '';

          Object.keys(data).forEach(sensorId => {
              const sensor = data[sensorId];
              const sensorDiv = document.createElement('div');
              sensorDiv.className = 'sensor-data';
              sensorDiv.id = sensorId;

              sensorDiv.innerHTML = `
                  <h2>Sensor ${sensorId}</h2>
                  <p>Type: ${sensor.type}</p>
                  <p>Status: ${sensor.status}</p>
                  <p>Value: ${sensor.value}</p>
                  <p>Last Updated: ${sensor.timestamp}</p>
              `;

              sensorHolder.appendChild(sensorDiv);
              
              // Запуск интервала для отправки данных, если его еще нет
              if (!sensorIntervals[sensorId]) {
                  startSensor(sensorId, sensor.type, 5000); // Интервал можно настроить
              }
          });
      } catch (error) {
          console.error('Error fetching sensor data:', error);
      }
  }

  createSensorButton.addEventListener('click', async () => {
      const type = document.getElementById('sensor-type').value;
      const status = document.getElementById('sensor-status').value;
      try {
          const response = await fetch('/create-sensor', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ type, status })
          });
          const data = await response.json();
          console.log('Sensor created:', data);
          fetchSensors();
      } catch (error) {
          console.error('Error creating sensor:', error);
      }
  });

  function startSensor(sensorId, type, interval) {
      if (sensorIntervals[sensorId]) {
          clearInterval(sensorIntervals[sensorId]);
      }
      sensorIntervals[sensorId] = setInterval(() => sendDataToServer(sensorId, type), interval);
  }

  function sendDataToServer(sensorId, type) {
      const data = generateSensorData(sensorId, type);
      console.log(`Sensor ${sensorId}: Sending data:`, data);

      fetch('/sensor-data', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
          console.log(`Sensor ${sensorId}: Response:`, data);
      })
      .catch(error => {
          console.error(`Sensor ${sensorId}: Error sending data:`, error);
      });
  }

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

  fetchSensors();
  setInterval(fetchSensors, 5000);
});
