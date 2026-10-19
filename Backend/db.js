const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is missing. Add it to your .env file (see .env.example).");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    const { host, name } = mongoose.connection;
    console.log(`✅ MongoDB connected → ${host}/${name}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("   Check your MONGO_URI in .env (and that your IP is allowed in Atlas).");
    process.exit(1);
  }
}

module.exports = connectDB;
