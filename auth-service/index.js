require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Database & Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Auth Microservice Connected');
    const port = process.env.PORT || 8080;
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Auth Microservice running on port ${port}`);
    });
  })
  .catch(err => console.error('❌ MongoDB Error:', err));
