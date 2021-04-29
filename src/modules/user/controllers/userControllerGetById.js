import User from '../userModel.js';
import message from '../../utils/messages.js';
import mongoose from 'mongoose';
import analytics from '../../analytics/controllers/analytics.js';

const ObjectId = mongoose.Types.ObjectId;

const userGetById = (req, res) => {
  const userId = req.params.userId;

  User.aggregate([
    {
      $match: {
        _id: ObjectId(userId),
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
        countryCode: '$countryCode',
        firstName: '$firstName',
        lastName: '$lastName',
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
        analytics('USER_GET_BY_ID_SUCCESS', {
          userId: userId,
          user: userId,
        });

        res.status(200).json(message.success('User get by Id. Success', doc));
      } else {
        const analyticsId = analytics('USER_GET_BY_ID_FAIL', {
          user: userId,
          controller: 'userGetById',
        });

        res.status(404).json(message.fail('No User for provided Id. Fail.', analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('USER_GET_BY_ID_ERROR', {
        error,
        controller: 'userGetById',
      });

      res.status(400).json(message.fail('User get by Id. Error', analyticsId));
    });
};

export default userGetById;
