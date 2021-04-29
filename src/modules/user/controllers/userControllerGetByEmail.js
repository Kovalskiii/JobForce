import User from '../userModel.js';
import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';

const userGetByEmail = (req, res) => {
  const { email } = req.params;
  const { userId } = req.userData;

  User.aggregate([
    {
      $match: {
        email,
      },
    },
    // {
    //   $lookup: {
    //     from: 'users',
    //     localField: 'users',
    //     foreignField: '_id',
    //     as: 'users',
    //   },
    // },

    {
      $project: {
        name: { $ifNull: ['$name', '$email'] },
        email: '$email',
        about: '$about',
        city: '$city',
        countryName: '$countryName',
        links: '$links',
        phone: { $ifNull: ['$phone', ''] },
        roles: { $ifNull: ['$roles', []] },
        rating: '$rating',
        createdAt: {
          $ifNull: [
            '$createdAt',
            {
              $dateFromString: {
                dateString: '2021-01-01',
              },
            },
          ],
        },
        emailConfirmed: '$emailConfirmation.confirmed',
      },
    },

    { $sort: { createdAt: 1 } },
  ])
    .then((doc) => {
      if (doc.length) {
        analytics('USER_GET_BY_EMAIL_SUCCESS', {
          user: userId,
          email: email,
        });

        res.status(200).json(message.success('User get by email. Success', doc));
      } else {
        const analyticsId = analytics('USER_GET_BY_EMAIL_FAIL', {
          user: userId,
          controller: 'userGetByEmail',
        });

        res.status(400).json(message.fail('No User for provided email. Fail.', analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_GET_BY_EMAIL_ERROR', {
        error,
        email,
        controller: 'userGetByEmail',
      });

      res.status(400).json(message.fail('User get by email. Error', analyticsId));
    });
};

export default userGetByEmail;
