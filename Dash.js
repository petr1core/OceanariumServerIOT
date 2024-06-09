document.addEventListener('DOMContentLoaded', () => {
    const sensorHolder = document.getElementById('sensor-holder');
    const createSensorButton = document.getElementById('create-sensor');
  
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
  
    fetchSensors();
    setInterval(fetchSensors, 5000);
  });
  