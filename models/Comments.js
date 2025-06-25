import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  blogSlug: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
});

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
