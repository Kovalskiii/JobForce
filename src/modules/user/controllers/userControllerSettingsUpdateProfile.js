import User from '../userModel.js';
import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';
import pkg from 'lodash';

const { get } = pkg;
import { countriesWithCode } from '../schemaData/countries.js';

async function userSettingsUpdateProfile(req, res) {
  const userId = get(req, 'userData.userId', null);
  const firstName = get(req, 'body.firstName', null);
  const lastName = get(req, 'body.lastName', null);
  const about = get(req, 'body.about', null);
  const countryName = get(req, 'body.countryName', null);
  const city = get(req, 'body.city', null);
  const state = get(req, 'body.state', '');
  const countryCode = countriesWithCode.find((el) => el.countryName === countryName).countryCode;
  const phone = get(req, 'body.phone', null);
  const linkedIn = get(req, 'body.links.linkedIn', null);
  const resume = get(req, 'body.links.resume', null);
  const facebook = get(req, 'body.links.facebook', null);


  const profile = {
    name: `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    about,
    countryName,
    city,
    state,
    countryCode,
    phone,
    links: {
      linkedIn: linkedIn,
      resume: resume,
      facebook: facebook,
    },
  };

  User.findOneAndUpdate({ _id: userId }, { $set: profile }, { runValidators: true })
    .exec()
    .then((doc) => {
      analytics('USER_UPDATE_PROFILE_SUCCESS', {
        user: userId,
        body: doc,
      });
      res.status(200).json(message.success('User profile updated'));
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_UPDATE_PROFILE_ERROR', {
        error: error.message,
        user: userId,
        body: req.body,
        controller: 'userSettingsUpdateProfile',
      });
      res.status(400).json(message.fail('User update profile. Error', analyticsId));
    });
}

export default userSettingsUpdateProfile;
