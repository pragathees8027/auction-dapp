import mongoose  from "mongoose";


export const User = mongoose.models.User || mongoose.model("User",new mongoose.Schema({
  username: { type: String, required: true , unique: true},
  password: { type: String, required: true },
}, {
  indexes: [{ key: { username: 1 }, unique: true }] // Create an index on the username field
}))

export const Item = mongoose.models.Item || mongoose.model("Item",new mongoose.Schema({
  itemname: { type: String, required: true },
  itemprice: { type: Number, required: true },
  datetime: { type: Date, required: true },
  itemowner: { type: String, required: true },
  available: {type: Boolean, required: true},
}))

const MONGODB_URI = process.env.MONGO_URL || "mongodb://localhost:27017/auction";


if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
  
  // Define the shape of our global mongoose object
  let cached = global.mongoose;
  
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }
  
  export const  dbConnect = async function () {
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
      throw e;
    }
  
    return cached.conn;
  }
  
  


