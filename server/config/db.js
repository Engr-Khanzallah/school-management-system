const mongoose = require('mongoose');

// Serverless (Vercel) mein connection ko reuse karte hain
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set');

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
      .then((m) => {
        console.log(`MongoDB connected: ${m.connection.host}`);
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
};

module.exports = connectDB;