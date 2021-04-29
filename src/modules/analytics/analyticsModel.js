import mongoose from 'mongoose';

const Schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    event: { type: String, required: true },
    params: {
      type: Object,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model('Analytics', Schema);
