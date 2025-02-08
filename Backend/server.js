require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./config/firebase');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());


// Basic route
const authRoutes = require("./routes/authRoutes");
const dailyRoutineRoutes = require("./routes/dailyRoutineRoutes");
const prayerRoutes = require("./routes/prayerRoutes")

app.use("/api/auth", authRoutes);
app.use("/api", dailyRoutineRoutes);
app.use("/api", prayerRoutes); 

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Prayer Tracker API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});