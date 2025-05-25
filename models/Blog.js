// models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String, // URL to S3
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  metaTitle: {
    type: String,
    trim: true,
  },
  metaDescription: {
    type: String,
    trim: true,
  },
  keywords: {
    type: String, // comma-separated
    trim: true,
  },
  author: {
    type: String,
    default: 'Admin',
  },
  category: {
    type: String,
    default: 'uncategorized',
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  views: {
    type: Number,
    default: 0,
  },
  viewsByDate: {
    type: Map,
    of: Number,
    default: {},
  },
  date: {
    type: Date,
    default: Date.now,
  },
  deleted: { 
    type: Boolean, 
    default: false, 
    index: true },    // ← new flag
    }, 
  { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
