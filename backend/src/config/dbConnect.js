const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${mongoose.connection.name}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
  }
}

module.exports = connectDB;