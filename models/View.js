import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  ip: String,
  viewedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.View || mongoose.model("View", viewSchema);
