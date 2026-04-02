require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Database & Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Feedback Microservice Connected');
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => console.error('❌ MongoDB Error:', err));
