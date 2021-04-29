import User from '../userModel.js';

export function checkIsUserExistQuery(email) {
  return User.findOne({ email: email })
    .exec()
    .then((doc) => !!doc)
    .catch(() => false);
}
