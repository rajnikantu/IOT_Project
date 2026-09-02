async function getData() {
  try {
    const res = await fetch('/api/bins');
    const data = await res.json();
    document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

    const grid = document.getElementById('binsGrid');
    if (!data.result || data.result.length === 0) {
      grid.innerHTML = '<p class="meta">No bin data found. Start simulator!</p>';
      return;
    }

    grid.innerHTML = data.result.map(bin => {
      const cls = bin.status === 'full' ? 'full' : bin.status === 'half' ? 'half' : 'empty';
      const fill = Math.min(100, Math.max(0, bin.fillLevel || 0));
      return `
        <div class="card">
          <h3>${bin.name}</h3>
          <p>📍 Location: (${bin.location?.x ?? 0}, ${bin.location?.y ?? 0})</p>
          <div class="progress">
            <div class="bar bg-${cls}" style="width: ${Math.max(fill, 8)}%">${fill}%</div>
          </div>
          <span class="badge badge-${cls}">${bin.status}</span>
        </div>
      `;
    }).join('');
  } catch (err) {
    document.getElementById('binsGrid').innerHTML = '<p class="meta">Cannot connect to server.</p>';
  }
}

async function getRoute() {
  try {
    const res = await fetch('/api/route');
    const data = await res.json();
    const box = document.getElementById('routeResult');
    box.style.display = 'block';

    if (!data.route || data.route.length === 0) {
      box.innerHTML = '<h3>🚛 Collection Route</h3><p class="meta">No full bins to collect right now.</p>';
      return;
    }

    let steps = `<div class="step">🏢 <strong>START:</strong> Depot (0, 0)</div>`;
    data.route.forEach((b, i) => {
      steps += `<div class="step">📍 <strong>Step ${i + 1}:</strong> ${b.name} (${b.fillLevel}%) @ (${b.location.x}, ${b.location.y})</div>`;
    });
    steps += `<div class="step">🏢 <strong>END:</strong> Return to Depot (0, 0)</div>`;

    box.innerHTML = `
      <h3>🚛 Optimized Route (${data.route.length} full bins)</h3>
      ${steps}
      <div class="total">📏 Total Distance: ${data.totalDistance} units</div>
    `;
  } catch (err) {
    console.error('Route error:', err);
  }
}

getData();
setInterval(getData, 5000);
