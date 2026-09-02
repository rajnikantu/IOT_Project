require('dotenv').config();
const http = require('http');

const PORT = process.env.PORT || 3000;
const bins = [
  { name: "Bin-A1", location: { x: 2, y: 5 } },
  { name: "Bin-B2", location: { x: 8, y: 3 } },
  { name: "Bin-C3", location: { x: 4, y: 9 } },
  { name: "Bin-D4", location: { x: 7, y: 7 } },
  { name: "Bin-E5", location: { x: 1, y: 2 } },
  { name: "Bin-F6", location: { x: 9, y: 8 } }
];

let levels = bins.map(() => Math.floor(Math.random() * 30));

function getStatus(fill) {
  return fill > 70 ? 'full' : fill > 30 ? 'half' : 'empty';
}

function updateBins() {
  console.log(`\n--- Sensor Update (${new Date().toLocaleTimeString()}) ---`);
  
  bins.forEach((bin, i) => {
    levels[i] += Math.floor(Math.random() * 10) + 1;
    if (levels[i] > 100) levels[i] = Math.floor(Math.random() * 10);
    
    const fillLevel = levels[i];
    const status = getStatus(fillLevel);
    
    console.log(`${bin.name}: ${fillLevel}% [${status}]`);

    const data = JSON.stringify({ name: bin.name, fillLevel, status, location: bin.location });
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/bins/update',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    });
    req.on('error', () => {});
    req.write(data);
    req.end();
  });
}

console.log(`IoT Simulator started on port ${PORT} (sending data every 5s)...`);
updateBins();
setInterval(updateBins, 5000);
