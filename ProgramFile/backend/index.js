require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB error:', err.message));

const Bin = mongoose.model('Bin', new mongoose.Schema({
  name: { type: String, unique: true },
  fillLevel: { type: Number, default: 0 },
  status: { type: String, default: 'empty' },
  location: { x: Number, y: Number },
  lastUpdated: { type: Date, default: Date.now }
}));

app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));

app.get('/api/bins', async (req, res) => {
  const bins = await Bin.find({});
  res.json({ status: true, result: bins });
});

app.post('/api/bins/update', async (req, res) => {
  const { name, fillLevel, status, location } = req.body;
  const bin = await Bin.findOneAndUpdate(
    { name },
    { fillLevel, status, location, lastUpdated: new Date() },
    { upsert: true, new: true }
  );
  res.json({ status: true, result: bin });
});

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

app.get('/api/route', async (req, res) => {
  const fullBins = await Bin.find({ status: 'full' });
  let unvisited = fullBins.map(b => ({ name: b.name, fillLevel: b.fillLevel, location: b.location }));
  
  let route = [], current = { x: 0, y: 0 }, totalDistance = 0;
  
  while (unvisited.length > 0) {
    let nearestIdx = 0, minDist = dist(current, unvisited[0].location);
    for (let i = 1; i < unvisited.length; i++) {
      let d = dist(current, unvisited[i].location);
      if (d < minDist) { minDist = d; nearestIdx = i; }
    }
    current = unvisited[nearestIdx].location;
    totalDistance += minDist;
    route.push(unvisited.splice(nearestIdx, 1)[0]);
  }
  
  if (route.length > 0) totalDistance += dist(current, { x: 0, y: 0 });
  
  res.json({ status: true, route, totalDistance: Math.round(totalDistance * 100) / 100 });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on ({port})`));
