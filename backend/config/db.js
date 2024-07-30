const mongoose = require("mongoose");
const GridFSBucket = mongoose.mongo.GridFSBucket;

let conn; // Define a module-level variable to hold the connection
let bucket; // Define a module-level variable to hold the GridFS bucket

const connectDB = async () => {
  if (conn) {
    return { conn }; // Return the existing connection if they exist
  }

  try {
    conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "todoListApp",
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);

    return { conn };
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
