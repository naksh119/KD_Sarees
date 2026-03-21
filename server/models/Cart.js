import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    priceAtAddTime: { type: Number, required: true, min: 0 },
    productName: { type: String, trim: true, default: '' },
    productDescription: { type: String, trim: true, default: '' },
    productImage: { type: String, trim: true, default: '' },
    productCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true, index: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);
