import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  bio: { type: String },
  website: { type: String },
  social: {
    twitter: String,
    linkedin: String,
    instagram: String,
  },
}, { timestamps: true });

export default mongoose.models.Author || mongoose.model("Author", AuthorSchema);
