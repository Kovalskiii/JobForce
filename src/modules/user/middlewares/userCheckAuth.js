import jwt from 'jsonwebtoken';
import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';
import userUpdateByIdQuery from '../queries/updateById.js';

const userCheckAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    req.userData = jwt.verify(token, process.env.JWT_KEY); // decoded JWT key

    // Updating lastLogin date during user auth
    userUpdateByIdQuery({
      userId: req.userData.userId,
      values: { lastLogin: { date: new Date() } },
    });
    next();
  } catch (error) {
    const analyticsId = analytics("USER_CHECK_AUTH_ERROR", {
      error: error.message,
      controller: 'userCheckAuth',
      req,
    });

    return res.status(400).json(message.fail('Auth failed', analyticsId));
  }
};

export default userCheckAuth;
