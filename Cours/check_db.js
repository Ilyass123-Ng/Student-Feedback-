const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cours-db');
    const count = await Course.countDocuments();
    const courses = await Course.find();
    console.log(`--- DB Check: ${count} courses found ---`);
    console.log(JSON.stringify(courses, null, 2));
    mongoose.connection.close();
  } catch (error) {
    console.error('!!! DB Check Error:', error);
  }
};

checkDB();
