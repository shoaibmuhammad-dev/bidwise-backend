const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("DB is connected");
  } catch (error) {
    console.error("DB connection error >>> ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
