import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  content: { type: String, required: true },
  featuredImage: { type: String, default: '' },
  tags: { type: [String], default: [] },
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  keywords: { type: String, trim: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reference to User model
    required: false
  },
  category: { type: String, default: 'uncategorized' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  views: { type: Number, default: 0 },
  viewsByDate: { type: Map, of: Number, default: {} },
  deleted: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', postSchema);
