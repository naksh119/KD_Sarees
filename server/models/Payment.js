import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['cod', 'card', 'upi', 'netbanking'], required: true },
    status: { type: String, enum: ['created', 'success', 'failed', 'refunded'], default: 'created' },
    gatewayTxnId: { type: String, trim: true, default: '' },
    failureReason: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
