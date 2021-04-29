import User from '../userModel.js';
import bcrypt from 'bcryptjs';
import analytics from '../../analytics/controllers/analytics.js';
import message from '../../utils/messages.js';
import { checkPassword } from './utils.js';
import hashPassword from '../helpers/hashPassword.js';
import pkg from 'lodash';

const { get } = pkg;

function userSettingsUpdatePassword(req, res) {
  const userId = get(req, 'userData.userId', null);
  const oldPassword = get(req, 'body.oldPassword', null);
  const newPassword = get(req, 'body.newPassword', null);
  const confirmPassword = get(req, 'body.confirmPassword', null);

  User.findOne({ _id: userId })
    .select('+password')
    .exec()
    .then((user) => {
      if (user) {
        bcrypt.compare(oldPassword, user.password, async (err, result) => {
          if (err) {
            const analyticsId = analytics('USER_SETTINGS_OLD_PASSWORD_ERROR', {
              _id: userId,
              reason: err,
            });

            return res
              .status(400)
              .json(message.fail('User settings update password. Failed', analyticsId));
          } else if (result) {
            if (newPassword === confirmPassword) {
              if (!checkPassword(newPassword)) {
                const reason = 'Wrong password format';
                const analyticsId = analytics('USER_SETTINGS_NEW_PASSWORD_ERROR', {
                  _id: userId,
                  reason,
                });

                res.status(400).json(message.fail(reason, analyticsId));
              } else {
                const newHash = hashPassword(newPassword);
                User.updateOne(
                  { _id: userId },
                  { $set: { password: newHash } },
                  { runValidators: true },
                )
                  .exec()
                  .then((doc) => {
                    if (doc.n) {
                      analytics('USER_SETTINGS_UPDATE_PASSWORD_SUCCESS', {
                        user: userId,
                      });
                      res.status(200).json(message.success('User password updated'));
                    } else {
                      analytics('USER_SETTINGS_UPDATE_PASSWORD_ERROR', {
                        reason: 'User _id not found in User.updateOne',
                        user: userId,
                      });
                      res
                        .status(400)
                        .json(message.fail('User settings update password. Error'));
                    }
                  })
                  .catch((error) => {
                    const analyticsId = analytics('USER_SETTINGS_UPDATE_PASSWORD_ERROR', {
                      error: error.message,
                      user: userId,
                      controller: 'userControllerSettingsUpdatePassword',
                    });
                    res
                      .status(400)
                      .json(
                        message.fail('User settings update password. Error', analyticsId),
                      );
                  });
              }
            } else {
              const analyticsId = analytics('USER_SETTINGS_NEW_PASSWORD_FAIL', {
                _id: userId,
                reason: 'newPassword is differ to confirmPassword',
              });

              res
                .status(400)
                .json(message.fail('User settings update password. Fail', analyticsId));
            }
          } else {
            const analyticsId = analytics('USER_SETTINGS_OLD_PASSWORD_ERROR', {
              _id: userId,
              reason: 'Incorrect Old password',
            });

            res
              .status(400)
              .json(message.fail('User settings update password. Error', analyticsId));
          }
        });
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_SETTINGS_UPDATE_PASSWORD_ERROR', {
        _id: userId,
        controller: 'userControllerSettingsUpdatePassword',
        error,
      });

      res
        .status(400)
        .json(message.fail('User settings update password. Error', analyticsId));
    });
}

export default userSettingsUpdatePassword;
