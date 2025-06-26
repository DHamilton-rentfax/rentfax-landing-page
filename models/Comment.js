import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    blogSlug: { type: String, required: true },
    content: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent recompilation in dev
export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
