import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  authorEmail: { type: String, required: true },
  text: { type: String, required: true },
  avatar: { type: String },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);
