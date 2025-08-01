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
  keywords: { type: String, trim: true }, // You can convert this to [String] later if needed

  // ✅ Blog author references User model
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // ✅ Enforce authorName always present
  authorName: {
    type: String,
    required: true,
    default: 'Unknown',
    trim: true,
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ✅ Auto-computed read time (~200 words/min)
postSchema.virtual('readTime').get(function () {
  const words = this.content?.split(/\s+/)?.length || 0;
  return Math.max(1, Math.round(words / 200));
});

export default mongoose.models.Post || mongoose.model('Post', postSchema);
