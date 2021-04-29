import message from '../utils/messages.js';
import analytics from '../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;

const userCheckEmailSendPerm = (req, res, next) => {
  const requestUserId = get(req, 'body.userId', '');

  const currentUserId = get(req, 'userData.userId', '');
  const currentUserRoles = get(req, 'userData.roles', []);

  if (currentUserId === requestUserId || currentUserRoles.includes('admin')) {
    next();
  } else {
    //
    const analyticsId = analytics('USER_CHECK_EMAIL_SEND_PERM_FAIL', {
      body: req.body,
      user: currentUserId,
      currentUserRoles,
      permission: 'userCheckEmailSendPerm',
    });

    return res
      .status(400)
      .json(message.fail('User check email send permission. Fail', analyticsId));
  }
};

export default userCheckEmailSendPerm;
