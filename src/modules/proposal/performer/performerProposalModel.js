import mongoose from 'mongoose';

const performerProposalSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      match: /^\d+(\d{3})*(\.\d{1,2})?$/m,
    },

    jobProposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobProposal',
      required: false,
    },

    approved: {
      type: Boolean,
      required: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  { timestamps: {} },
);

export default mongoose.model('PerformerProposal', performerProposalSchema);
