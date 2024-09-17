import mongoose  from "mongoose";
export const User = mongoose.models.User || mongoose.model("User",new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true},
}))