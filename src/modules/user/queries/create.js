import User from '../userModel.js';
import message from '../../utils/messages.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import analytics from '../../analytics/controllers/analytics.js';
import { sendMailCreatedUser } from '../helpers/sendMailCreatedUser.js';

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const userCreateQuery = (user) => {
  const emailHashConfirmation = new mongoose.Types.ObjectId();

  const newUser = new User({
    _id: user._id,

    email: user.email,
    emailConfirmation: {
      hash: emailHashConfirmation,
      confirmed: false,
    },

    name: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    about: user.about,
    links: {
      linkedIn: '',
      resume: '',
      facebook: '',
    },

    countryName: user.countryName,
    city: '',
    state: '',
    countryCode: user.countryCode,
    phone: user.phone,

    rating: {
      averageRating: 0,
      fiveStarCount: 0,
      fourStarCount: 0,
      threeStarCount: 0,
      twoStarCount: 0,
      oneStarCount: 0
    },


    password: hashPassword(user.password),

    roles: ['new'],

  });

  return newUser
    .save()
    .then(() => {
      //Dedicated for sent mail to user about success registration
      sendMailCreatedUser({
          email: user.email,
          emailHashConfirmation,
          firstName: user.firstName,
          lastName: user.lastName,
          userId: user._id,
      }).catch((error) => {
          //
          analytics('USER_REGISTER_ERROR', {
              userData: { ...user, password: null },
          });

          throw new Error(error);
      });

      return message.success('User created successfully', user._id);
    })
    .catch((error) => {
      if (error.code === 11000) return message.fail('User with entered email exist');
      return message.fail('Error', error);
    });
};

export default userCreateQuery;
