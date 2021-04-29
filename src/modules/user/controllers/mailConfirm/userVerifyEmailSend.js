import User from '../../userModel.js';
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;
import { sendMailCreatedUser } from '../../helpers/sendMailCreatedUser.js';

//This controller Dedicated to send again confirmation letter on user email//

const userVerifyEmailSend = (req, res) => {
  const userId = get(req, 'body.userId', '');

  User.findById(userId)
    .select('+emailConfirmation.hash')
    .exec()
    .then(async (doc) => {
      if (doc) {
        const isEmailConfirmed = get(doc, 'emailConfirmation.confirmed', false);

        if (!isEmailConfirmed) {
          const email = doc.email;
          const emailHashConfirmation = doc.emailConfirmation.hash;
          const firstName = get(doc, 'firstName', '');
          const lastName = get(doc, 'lastName', '');

          const sendEmail = await sendMailCreatedUser({
            email,
            emailHashConfirmation,
            firstName,
            lastName,
            userId,
          });

          if (sendEmail.success) {
            return res.status(200).json(sendEmail);
          } else {
            return res.status(400).json(sendEmail);
          }
        } else {
          const reason = 'Email already confirmed';
          //
          const analyticsId = analytics('USER_VERIFY_EMAIL_SEND_FAIL', {
            reason,
            user: userId,
          });

          res.status(400).json(message.fail(reason, analyticsId));
        }
      } else {
        const reason = 'User for sending email not found';
        //
        const analyticsId = analytics('USER_VERIFY_EMAIL_SEND_FAIL', {
          reason,
          user: userId,
          controller: 'userVerifyEmailSend',
        });

        res.status(400).json(message.fail(reason, analyticsId));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_VERIFY_EMAIL_SEND_ERROR', {
        error,
        body: req.body,
        controller: 'userVerifyEmailSend',
      });

      res.status(400).json(message.fail('Send email. Error', analyticsId));
    });
};

export default userVerifyEmailSend;
