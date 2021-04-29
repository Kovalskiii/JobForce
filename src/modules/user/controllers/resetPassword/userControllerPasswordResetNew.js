import bcrypt from 'bcryptjs';
import User from '../../userModel.js';
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;
import { isHashValid as _isHashValid } from './isHashValid.js';
import { checkPassword, validateObjectId } from './../utils.js';
import sendEmailViaSendGrid from '../../helpers/sendEmailViaSendGrid.js';

//This controller Dedicated to reset password//

const emailTemplate = () => {
  const host = process.env.CLIENT_HOST;
  const link = `${host}/login`;
  return {
    html: `Your password has been changed <br/>
          Use <a href=${link}>${link}</a> to login<br/><br/>
          Thanks,<br/>
          Your friends at JobForce`,
    text: `Your password has been changed\nUse the link ${link} to login\n\nThanks,\nYour friends at JobForce`,
  };
};

const userPasswordResetNew = async (req, res) => {
  const { userId, password } = req.body;
  const hash = get(req, 'body.hash', '').trim();

  if (!checkPassword(password)) {
    const reason = 'Wrong password format';
    //
    const analyticsId = analytics('USER_PASSWORD_CHANGE_FAIL', {
      reason: reason,
      userId,
      hash,
    });

    return res.status(400).json(message.fail(reason, analyticsId));
  }

  if (!validateObjectId(hash)) {
    const reason = 'Wrong hash format';
    //
    const analyticsId = analytics('USER_PASSWORD_CHANGE_FAIL', {
      reason: reason,
      userId,
      hash,
    });

    return res.status(400).json(message.fail(reason, analyticsId));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const getUserResult = await getUserById(userId);

  if (getUserResult.success) {
    const user = getUserResult.payload;
    const isHashValid = _isHashValid(user, hash);

    if (isHashValid) {
      const updateHashResult = await updateHash({ userId, hashedPassword });

      if (updateHashResult.success) {
        const subject = '[JobForce] Your password has been changed';
        await sendEmailViaSendGrid(user.email, subject, emailTemplate());

        analytics('USER_PASSWORD_CHANGE_SUCCESS', {
          user: userId,
          hash,
        });

        return res
          .status(200)
          .json(message.success('Your password has been changed successfully'));
      } else {
        //
        const analyticsId = analytics('USER_PASSWORD_CHANGE_FAIL', {
          reason: {
            updateHashResult: updateHashResult.payload,
            isHashValid,
          },
          user: userId,
          hash,
        });

        return res.status(400).json(message.fail('Invalid link', analyticsId));
      }
    } else {
      //
      const analyticsId = analytics('USER_PASSWORD_CHANGE_FAIL', {
        reason: {
          isHashValid,
        },
        user: userId,
        hash,
      });

      return res.status(400).json(message.fail('Invalid link', analyticsId));
    }
  } else {
    //
    const analyticsId = analytics('USER_PASSWORD_CHANGE_FAIL', {
      reason: getUserResult.payload,
      hash,
    });

    return res.status(400).json(message.fail('Change password error', analyticsId));
  }
};

function getUserById(userId) {
  return User.findOne({ _id: userId })
    .select('+resetPassword.hash +resetPassword.date')
    .exec()
    .then((user) => {
      if (user) {
        return message.success('User', user);
      } else {
        return message.fail('User not found');
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_PASSWORD_CHANGE_ERROR', {
        error,
        controller: 'getUserById',
      });

      return message.fail('Get User error', analyticsId);
    });
}

function updateHash({ userId, hashedPassword }) {
  return User.updateOne(
    { _id: userId },
    {
      $set: {
        password: hashedPassword,
        'resetPassword.hash': '',
        'resetPassword.date': Date.now(),
      },
      $push: { 'resetPassword.history': { date: new Date() } },
    },
    { runValidators: true },
  )
    .exec()
    .then((user) => {
      if (user) {
        return message.success('Hash updated');
      } else {
        return message.fail('User not found');
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_PASSWORD_CHANGE_ERROR', {
        error,
        user: userId,
        controller: 'updateHash',
      });

      return message.fail('Get User error', analyticsId);
    });
}

export default userPasswordResetNew;
