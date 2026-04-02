require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/courses', require('./routes/courseRoutes'));

// Database & Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Cours Microservice Connected');
    app.listen(process.env.PORT || 4000);
  })
  .catch(err => console.error('❌ MongoDB Error:', err));
