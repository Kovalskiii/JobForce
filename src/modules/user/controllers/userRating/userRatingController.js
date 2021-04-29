import User from '../../userModel.js';
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';

const { get } = pkg;

//This controller counting average user Rating and update parameters in database.

async function userRatingCounting(req, res) {

  const userId = get(req, 'params.userId');
  const setRating = get(req, 'body.setRating', null); //can be only from 1 to 5 !!!

  let average = 0;
  let fiveStarCount = 0;
  let fourStarCount = 0;
  let threeStarCount = 0;
  let twoStarCount = 0;
  let oneStarCount = 0;

  let ratingObj = {
    rating: {
      averageRating: average,
      fiveStarCount: fiveStarCount,
      fourStarCount: fourStarCount,
      threeStarCount: threeStarCount,
      twoStarCount: twoStarCount,
      oneStarCount: oneStarCount,
    }
  }

  let userFind = await User.findById(userId)
    .then((doc) => {
      if (doc) {
        //
        oneStarCount = doc.rating.oneStarCount;
        twoStarCount = doc.rating.twoStarCount;
        threeStarCount = doc.rating.threeStarCount;
        fourStarCount = doc.rating.fourStarCount;
        fiveStarCount = doc.rating.fiveStarCount;

        switch (setRating) {
          case 1:
            oneStarCount++;
            break;
          case 2:
            twoStarCount++;
            break;
          case 3:
            threeStarCount++;
            break;
          case 4:
            fourStarCount++;
            break;
          case 5:
            fiveStarCount++;
            break;

          default:
            break;

        }

        average = ((5 * fiveStarCount + 4 * fourStarCount + 3 * threeStarCount + 2 * twoStarCount + oneStarCount)
          / (fiveStarCount + fourStarCount + threeStarCount + twoStarCount + oneStarCount)).toFixed(2);

        ratingObj = {
          rating: {
            averageRating: average,
            fiveStarCount: fiveStarCount,
            fourStarCount: fourStarCount,
            threeStarCount: threeStarCount,
            twoStarCount: twoStarCount,
            oneStarCount: oneStarCount,
          }
        }

        return message.success('User found. Success.');

      } else {
        const reason = 'User not found.';
        const analyticsId = analytics('USER_NOT_FOUND_FAIL', {
          reason,
          averageRating: average,
          body: req.body,
          user: userId,
          controller: 'userRatingController',
        });
        return res.status(404).json(message.fail('User not found. Fail.', analyticsId));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_NOT_FOUND_ERROR', {
        error: error.message,
        user: userId,
        body: req.body,
        controller: 'userRatingController',
      });
      return res.status(400).json(message.fail('User not found. Error.', analyticsId));
    });


  if (userFind.success) {

    User.findOneAndUpdate({ _id: userId }, { $set: ratingObj }, { runValidators: true })
      .exec()
      .then((doc) => {
        analytics('USER_UPDATE_RATING_SUCCESS', {
          user: userId,
          body: req.body,
          averageRating: average,
          ratingObj: ratingObj,
        });
        res.status(200).json(message.success('User rating updated. Success.'));
      })
      .catch((error) => {
        //
        const analyticsId = analytics('USER_UPDATE_RATING_ERROR', {
          error: error.message,
          user: userId,
          body: req.body,
          controller: 'userRatingController',
        });
        res.status(400).json(message.fail('User update rating. Error', analyticsId));
      });
  }
}

export default userRatingCounting;
