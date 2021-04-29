import mongoose from 'mongoose';

const jobProposalSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    subject: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: false,
    },

    startPrice: {
      type: Number,
      required: true,
      match: /^\d+(\d{3})*(\.\d{1,2})?$/m,
    },

    countryName: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: false,
    },

    state: {
      type: String,
      required: false,
    },

    performerProposals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PerformerProposal',
        required: false,
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  { timestamps: {} },
);

export default mongoose.model('JobProposal', jobProposalSchema);
