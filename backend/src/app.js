const express = require('express');
const cors = require('cors');
require('dotenv').config();

const imageRoutes = require('./routes/imageRoutes');
const faultRoutes = require('./routes/faultRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/images', imageRoutes);
app.use('/api/faults', faultRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
