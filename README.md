#  IoT Smart E-Waste Management & Optimization System

An IoT-enabled smart e-waste monitoring and collection route optimization system. The platform monitors waste fill-levels in real time across city bins (simulating ultrasonic sensor hardware) and uses the **Traveling Salesperson Problem (TSP)** nearest-neighbor algorithm to compute the shortest, most efficient collection route for municipal trucks.

---

##  Key Features

- **Real-Time Waste Level Monitoring**: Live tracking of bin statuses (`empty`, `half`, `full`).
- **IoT Hardware Simulator (`simulator.js`)**: Replaces physical Arduino Uno + Ultrasonic sensors by simulating periodic telemetry POST requests to the backend server.
- **TSP Route Optimization**: Express backend calculates the optimal pickup sequence for full bins starting and ending at the municipal depot `(0, 0)` using Euclidean distance.
- **Clean Dashboard UI**: Light, responsive dashboard built with vanilla HTML, CSS, and JS.
- **Environment Configured**: Managed via `.env` environment variables (`PORT`, `MONGO_URI`).

---

##  Directory Structure

```
IOT_Project/
├── README.md
├── IOT_Project_detailed_description.pdf
└── ProgramFile/
    ├── backend/
    │   ├── .env              # Sensitive environment variables 
    │   ├── .env.example      # Sample environment template
    │   ├── index.js          # Express server & TSP routing logic
    │   ├── simulator.js       # Arduino sensor mock script
    │   ├── package.json      # Backend dependencies
    │   └── .gitignore
    └── frontend/
        ├── index.html         # Dashboard HTML structure
        ├── style.css          # Dashboard CSS styling
        └── script.js          # Dashboard live data fetching & UI logic
```

---

##  Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), `dotenv`, `cors`
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (Fetch API)
- **Algorithm**: Traveling Salesperson Problem (Nearest-Neighbor Euclidean distance)
- **Hardware Simulation**: Node.js HTTP Client (replacing Arduino Uno + Ultrasonic Sensors)

---

##  Setup & Execution Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 2. Environment Setup
Create a `.env` file inside `ProgramFile/backend/` using `.env.example` as reference:
```env
PORT=your_preferred_port
MONGO_URI=your_mongodb_connection_uri
```

### 3. Start Backend Server
```bash
cd ProgramFile/backend
npm install
npm start
```

### 4. Start IoT Hardware Simulator
Open a new terminal tab:
```bash
cd ProgramFile/backend
npm run sim
```

### 5. Open Dashboard
Open your web browser and visit: **`http://localhost:<PORT>`** (where `<PORT>` is the port specified in your `.env` file).

Click **"TSP Route"** to generate the shortest pickup path for full bins.
