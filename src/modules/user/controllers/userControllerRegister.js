import mongoose from 'mongoose';
import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;
import { checkPassword } from './utils.js';
import userCreateQuery from '../queries/create.js';
import { checkIsUserExistQuery } from '../queries/checkIsUserExistQuery.js';

const userRegister = async (req, res) => {
  const userId = new mongoose.Types.ObjectId();

  const user = {
    _id: userId,
    firstName: get(req, 'body.firstName'),
    lastName: get(req, 'body.lastName'),
    email: get(req, 'body.email').trim().toLowerCase(),
    password: get(req, 'body.password'),
    countryName: get(req, 'body.countryName', ''),
    countryCode: get(req, 'body.countryCode', ''),
    phone: get(req, 'body.phone', ''),
  };

  if (!checkPassword(user.password)) {
    const reason = 'Wrong password format';

    analytics('USER_REGISTER_FAIL', {
      reason: reason,
      userData: { ...user, password: null },
    });

    return res.status(400).json(message.fail(reason));
  }

  if (user.email.includes(' ')) {
    return res.status(400).json(message.fail('Incorrect email format'));
  }

  const isUserExists = await checkIsUserExistQuery(user.email);

  if (isUserExists) {
    //
    const analyticsId = analytics('USER_REGISTER_FAIL', {
      reason: 'Mail exists',
      userData: { ...user, password: null },
    });

    return res
      .status(409)
      .json(message.fail('User with this e-mail exists', analyticsId));
  }

  const createdUser = await userCreateQuery(user);

  if (createdUser.success) {

    analytics('USER_REGISTER_SUCCESS', {
      userData: {
        ...user,
        password: null,
      },
    });

    return res
      .status(201)
      .json(
        message.success(
          'User created successfully.',
        ),
      );
  } else {
    //
    const analyticsId = analytics('USER_REGISTER_FAIL', {
      reason: get(createdUser, 'payload.messages'),
      userData: { ...user, password: null },
    });

    return res.status(404).json(message.fail('User was not created', analyticsId));
  }
};

export default userRegister;
