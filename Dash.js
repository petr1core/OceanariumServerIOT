//Dash.js
// этот код может работать некорректно или быть вовсе сломан, нам предстоит его исправить

// Обработчик для кнопки "ВЫХОД"
document.getElementById('logout-button').addEventListener('click', () => {
  window.location.href = '/login';
});

/// часть для карты
let i = 0;
let per = JSON.parse(localStorage.getItem('mas')) || [];
let masOfOn = [];
per.forEach(element => {
  masOfOn.push(element.isOn);
});

document.querySelectorAll(".sens").forEach(value => {
  value.style.display = "none";
});

window.addEventListener('popstate', (event) => {
  event.preventDefault();
  console.log('User pressed the back button');
});

document.querySelectorAll('.sect').forEach(element => {
  element.addEventListener("click", function (event) {
    let ban = document.querySelectorAll(".sens");
    switch(event.target.id) {
      case "sec1":
        ban[1].style.removeProperty('display');
        ban[2].style.removeProperty('display');
        ban[3].style.removeProperty('display');
        break;
      case "sec2":
        ban[4].style.removeProperty('display');
        ban[5].style.removeProperty('display');
        ban[6].style.removeProperty('display');
        ban[7].style.removeProperty('display');
        ban[8].style.removeProperty('display');
        break;
      case "sec3":
        ban[0].style.removeProperty('display');
        break;
    }
    document.querySelector('#reverser').style.removeProperty('display');
    document.querySelector('#sec1').style.display = 'none';
    document.querySelector('#sec2').style.display = 'none';
    document.querySelector('#sec3').style.display = 'none';
    document.querySelectorAll("#sens").forEach((value) => {
      value.style.display = "none";
    }); 
  });
});

let btn = document.createElement('button');
btn.id = "reverser";
btn.style.display = "none";
btn.style.height = "100px";
btn.style.width = "200px";
btn.style.position = "absolute";
btn.style.left = "50px";
btn.style.top = "150px";
btn.innerText = 'Назад к секциям';
document.querySelector('body').append(btn);

document.querySelector("#create-sensor").addEventListener("click", () => {
  const map = document.querySelector("#map");
  map.addEventListener("click", addSensor);

  function addSensor(event) {
    const status = document.querySelector("#sensor-status").value;
    const sensor = document.createElement("div");
    sensor.classList.add("sens", status === "on" ? "on" : "off");
    const mapRect = map.getBoundingClientRect();
    sensor.style.left = `${event.clientX - mapRect.left}px`;
    sensor.style.top = `${event.clientY - mapRect.top}px`;
    sensor.id = i++;
    masOfOn.push(status === "on");
    document.querySelector('#map').appendChild(sensor);
    map.removeEventListener("click", addSensor);
    
    // Добавление обработчика кликов для нового датчика
    sensor.addEventListener("click", selectSensor);
  }
});

const reverser = document.querySelector("#reverser");
if (reverser !== null) {
  reverser.onclick = function () {
    document.querySelector('#reverser').style.display = "none";
    document.querySelector('#sec1').style.removeProperty('display');
    document.querySelector('#sec2').style.removeProperty('display');
    document.querySelector('#sec3').style.removeProperty('display');
    document.querySelectorAll(".sens").forEach(value => {
      value.style.display = "none";
    });
  };
}

setInterval(() => {
  document.querySelectorAll('.sens').forEach(element => {
    element.onclick = function (event) {
      localStorage.setItem('isOn', masOfOn[event.target.id]);
      window.location.href = './third.html';
    };
  });
}, 1000);

// Добавление обработчика кликов для существующих датчиков
document.querySelectorAll('.sens').forEach(sensor => {
  sensor.addEventListener("click", selectSensor);
});

function selectSensor(event) {
  document.querySelectorAll('.sens').forEach(sensor => {
    sensor.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');
}

//// часть для сенсорного взаимодействия

document.addEventListener('DOMContentLoaded', () => {
  const sensorHolder = document.getElementById('sensor-holder');
  const createSensorButton = document.getElementById('create-sensor');
  const logoutButton = document.getElementById('logout-button'); // добавляем кнопку выхода
  const sensorIntervals = {}; // Хранение интервалов для каждого датчика

  // Обработчик события для кнопки выхода
  logoutButton.addEventListener('click', () => {
    window.location.href = '/login';
  });

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
        
        // Запуск интервала для отправки данных, если его еще нет и если статус "on"
        if (!sensorIntervals[sensorId] && sensor.status === 'on') {
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
// если ты видишь две версии функции, одну с комментариями, другую - без, то вероятнее всего, что этот код нерабочий и его следует починить

//   function startSensor(sensorId, type, interval) {
//     if (sensorIntervals[sensorId]) {
//       clearInterval(sensorIntervals[sensorId]);
//     }
//     sensorIntervals[sensorId] = setInterval(() => sendDataToServer(sensorId, type), interval);
//   }

function startSensor(sensorId, type, interval) {
  if (sensorIntervals[sensorId]) {
    clearInterval(sensorIntervals[sensorId]);
  }
  const sensorDiv = document.getElementById(sensorId);
  if (sensorDiv && sensorDiv.querySelector('p:nth-child(3)').textContent.includes('Status: on')) {
    sensorIntervals[sensorId] = setInterval(() => sendDataToServer(sensorId, type), interval);
  }
}
//   function sendDataToServer(sensorId, type) {
//     const data = generateSensorData(sensorId, type);
//     console.log(`Sensor ${sensorId}: Sending data:`, data);

//     fetch('/sensor-data', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log(`Sensor ${sensorId}: Response:`, data);
//     })
//     .catch(error => {
//       console.error(`Sensor ${sensorId}: Error sending data:`, error);
//     });
//   }
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
