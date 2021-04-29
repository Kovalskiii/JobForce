import User from '../userModel.js';
import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';
import pkg from 'lodash';

const { get } = pkg;

const userDeleteByEmail = (req, res) => {
  const { userId } = req.userData;
  const deleteUser = get(req, 'params.email');

  User.deleteOne({ email: deleteUser })
    .exec()
    .then((doc) => {
      if (doc.n) {
        analytics('USER_DELETE_BY_EMAIL_SUCCESS', {
          deleteUser,
          user: userId,
        });

        res.status(200).json(message.success('User deleted'));
      } else {
        const reason = 'User with this email not found';
        const analyticsId = analytics('USER_DELETE_BY_EMAIL_FAIL', {
          reason: reason,
          deleteUser,
          user: userId,
        });

        res.status(400).json(message.fail(reason, analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_DELETE_BY_EMAIL_ERROR', {
        error,
        deleteUser,
        user: userId,
      });

      res.status(400).json(message.fail('User delete by email error', analyticsId));
    });
};

export default userDeleteByEmail;
