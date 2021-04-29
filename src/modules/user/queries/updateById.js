import User from '../userModel.js';
import message from '../../utils/messages.js';

const userUpdateByIdQuery = ({ userId, values }) => {
  return User.updateOne({ _id: userId }, { $set: values }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        return message.success('Success. User updated');
      } else {
        return message.fail('Fail. User not found');
      }
    })
    .catch((error) => {
      return message.fail('Error. User update error', error);
    });
};

export default userUpdateByIdQuery;
