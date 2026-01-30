import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/softonoma";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("EREFUSED") || message.includes("queryTxt")) {
      throw new Error(
        "Cannot reach MongoDB (DNS/network refused). Check: 1) Internet connection, 2) Firewall/VPN not blocking *.mongodb.net, 3) MongoDB Atlas IP whitelist (or 0.0.0.0/0 for dev). To run without Atlas, set MONGODB_URI=mongodb://localhost:27017/softonoma in .env and run MongoDB locally."
      );
    }
    throw e;
  }

  return cached.conn;
}

export default connectDB;
