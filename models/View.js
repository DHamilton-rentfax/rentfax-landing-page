import mongoose from 'mongoose';

const viewSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true,
  },
  ip: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.View || mongoose.model('View', viewSchema);
