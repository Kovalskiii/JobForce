import mongoose from 'mongoose';
import { listRoles } from '../permission/roles.js';

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    email: {
      type: String,
      required: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },

    emailConfirmation: {
      hash: { type: String, select: false },
      confirmed: {
        type: Boolean,
        default: false,
      },
    },

    name: {
      type: String,
      unique: false,
      trim: true,
      default: '',
    },

    firstName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      match: /^[A-Za-z\-']{1,20}$/,
      default: '',
    },

    lastName: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      match: /^[A-Za-z\-']{1,20}$/,
      default: '',
    },

    about: {
      type: String,
      default: '',
      required: false,
    },

    countryName: {
      type: String,
      required: false,
    },

    city: {
      type: String,
      required: false,
    },

    state: {
      type: String,
      required: false,
    },

    countryCode: {
      type: String,
      required: false,
      match: /^[1-9]{1,3}$/,
    },

    phone: {
      type: String,
      required: false,
      unique: false,
      match: /^[0-9]{8,11}$/,
    },

    rating: {
      averageRating: {
        type: Number,
        required: false,
        unique: false,
        //match: /^[0-9]+$/,
      },
      fiveStarCount: {
        type: Number,
        required: false,
        unique: false,
        match: /^[0-9]+$/,
      },
      fourStarCount: {
        type: Number,
        required: false,
        unique: false,
        match: /^[0-9]+$/,
      },
      threeStarCount: {
        type: Number,
        required: false,
        unique: false,
        match: /^[0-9]+$/,
      },
      twoStarCount: {
        type: Number,
        required: false,
        unique: false,
        match: /^[0-9]+$/,
      },
      oneStarCount: {
        type: Number,
        required: false,
        unique: false,
        match: /^[0-9]+$/,
      },
    },

    links: {
      linkedIn: {
        type: String,
        required: false,
        match: /^https:\/\/www.linkedin.com\/in/,
      },
      resume: {
        type: String,
        required: false,
        match: /^https:\/\/docs.google.com\/document/,
      },
      facebook: {
        type: String,
        required: false,
        match: /^https:\/\/www.facebook.com\//,
      },
    },


    password: {
      type: String,
      select: false,
      required: true,
    },

    resetPassword: {
      hash: { type: String, select: false },
      date: {
        select: false,
        type: Date,
        required: false,
      },
      history: [
        {
          date: Date,
        },
      ],
    },

    roles: [
      {
        type: String,
        required: false,
        enum: listRoles,
      },
    ],

  },

  { timestamps: {}, versionKey: false },
);

export default mongoose.model('User', userSchema);
