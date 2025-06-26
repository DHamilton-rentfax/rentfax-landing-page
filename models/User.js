import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ["editor", "admin"],
    default: ["editor"],
  },
  status: {
    type: String,
    enum: ["pending", "active", "rejected"],
    default: "pending",
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model("User", userSchema);
