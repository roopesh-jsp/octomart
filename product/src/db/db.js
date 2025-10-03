const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MONGO DB connected");
  } catch (error) {
    console.log("error connecting DB:", error);
  }
};

module.exports = connectDb;
