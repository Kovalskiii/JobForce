import { countriesWithCode } from '../schemaData/countries.js';
import message from '../../utils/messages.js';
import analytics from '../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;

const userGetCountryList = (req, res) => {
  const userId = get(req, 'userData.userId', null);

  analytics('USER_GET_ALL_COUNTRIES_SUCCESS', {
    countries: countriesWithCode,
    user: userId,
  });

  res.status(200).json(message.success('Get all countries. Success', countriesWithCode));
};

export default userGetCountryList;
