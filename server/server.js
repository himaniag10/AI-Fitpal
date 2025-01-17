const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const insightsRoutes = require('./routes/insights');



dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
connectDB();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});


app.use('/api/auth', authRoutes);
app.use('/api/insights', insightsRoutes);


app.get('/', (req, res) => {
    res.send('FitPal Backend API is Running');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: "API is running successfully!" });
  });
  


app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});