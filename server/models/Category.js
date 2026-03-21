import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, minlength: 2, maxlength: 80 },
    slug: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    description: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
