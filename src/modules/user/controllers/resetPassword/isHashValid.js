import moment from 'moment';
import pkg from 'lodash';
const { get } = pkg;
import { validateObjectId } from '../utils.js';

export function isHashValid(user, hash) {
  const hashDatetime = get(user, 'resetPassword.date', null);
  const storedHash = get(user, 'resetPassword.hash', null);
  const currentDatetime = moment();
  const differenceInMinutes = currentDatetime.diff(hashDatetime, 'minutes');
  return validateObjectId(hash) && storedHash === hash && differenceInMinutes <= 180; // Hash is valid only 3 hours
}
