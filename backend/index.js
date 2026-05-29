const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let sensorData = {
  kitchen: {
    dht11:  { temperature: 32.1, humidity: 68.4 },
    mq2:    { ppm: 210, analogVoltage: 1.23 },
    flame:  { detected: false, irIntensity: 95 }
  },
  bedroom: {
    dht11:  { temperature: 27.3, humidity: 58.2 },
    mq2:    { ppm: 145, analogVoltage: 0.89 },
    flame:  { detected: false, irIntensity: 60 }
  }
};

setInterval(() => {
  sensorData.kitchen.dht11.temperature = parseFloat((sensorData.kitchen.dht11.temperature + (Math.random()-0.5)*0.6).toFixed(1));
  sensorData.kitchen.dht11.humidity    = parseFloat((sensorData.kitchen.dht11.humidity    + (Math.random()-0.5)*1.0).toFixed(1));
  sensorData.kitchen.mq2.ppm          = Math.round(sensorData.kitchen.mq2.ppm + (Math.random()-0.5)*15);
  sensorData.kitchen.mq2.analogVoltage = parseFloat((sensorData.kitchen.mq2.analogVoltage + (Math.random()-0.5)*0.05).toFixed(2));
  sensorData.bedroom.dht11.temperature = parseFloat((sensorData.bedroom.dht11.temperature + (Math.random()-0.5)*0.4).toFixed(1));
  sensorData.bedroom.dht11.humidity    = parseFloat((sensorData.bedroom.dht11.humidity    + (Math.random()-0.5)*0.8).toFixed(1));
  sensorData.bedroom.mq2.ppm          = Math.round(sensorData.bedroom.mq2.ppm + (Math.random()-0.5)*10);
  sensorData.bedroom.mq2.analogVoltage = parseFloat((sensorData.bedroom.mq2.analogVoltage + (Math.random()-0.5)*0.04).toFixed(2));
}, 2000);

app.get('/api/sensors', (req, res) => {
  res.json({ success: true, timestamp: new Date().toISOString(), data: sensorData });
});

app.get('/api/sensors/:zone', (req, res) => {
  const zone = sensorData[req.params.zone];
  if (!zone) return res.status(404).json({ success: false, message: 'Zone not found' });
  res.json({ success: true, timestamp: new Date().toISOString(), data: zone });
});

app.post('/api/sensors/:zone', (req, res) => {
  const { zone } = req.params;
  if (!sensorData[zone]) return res.status(404).json({ success: false, message: 'Zone not found' });
  sensorData[zone] = { ...sensorData[zone], ...req.body };
  res.json({ success: true, message: 'Sensor data updated', data: sensorData[zone] });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('FireGuard backend running on http://localhost:' + PORT);
  console.log('  GET  /api/sensors');
  console.log('  GET  /api/sensors/:zone');
  console.log('  POST /api/sensors/:zone');
  console.log('  GET  /api/health');
});