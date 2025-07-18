import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  content: { type: String, required: true },
  featuredImage: { type: String, default: '' },
  tags: { type: [String], default: [], index: true },
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  keywords: { type: String, trim: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: { type: String, default: 'uncategorized', index: true },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
    index: true,
  },
  views: { type: Number, default: 0 },
  viewsByDate: {
    type: Map,
    of: Number,
    default: {},
  },
  deleted: { type: Boolean, default: false, index: true },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

export default mongoose.models.Post || mongoose.model('Post', postSchema);
