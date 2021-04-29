import message from '../utils/messages.js';
import User from '../user/userModel.js';
import roles from './roles.js';
import analytics from '../analytics/controllers/analytics.js';
import pkg from 'lodash';
//import PerformerProposal from "../proposal/performer/performerProposalModel.js";

const { get } = pkg;

export const userCan = (userRoles, checkedPermission) => {
  for (let i = 0; i < userRoles.length; i += 1) {
    if (roles[userRoles[i]].includes(checkedPermission)) return true;
  }

  return false;
};

const userCheckPerm = (checkedPermission) => (req, res, next) => {
  const userId = get(req, 'userData.userId', null);

  User.findById(userId)
    .select('-__v')
    .exec()
    .then((doc) => {
      if (doc) {
        const roles = get(doc, 'roles', []);

        if (userCan(roles, checkedPermission)) {
          req.userData.roles = roles;
          req.userData.name = get(doc, 'name');
          req.userData.links = get(doc, 'links');
          req.userData.rating = get(doc, 'rating');
          req.userData.emailConfirmation = get(doc, 'emailConfirmation');
          next();
        } else {
          const reason = 'Permission denied';
          const analyticsId = analytics('USER_CHECK_PERMISSION_FAIL', {
            reason,
            roles,
            user: userId,
          });

          res.status(400).json(message.fail(reason, analyticsId));
        }
      } else {
        const reason = 'Current user not found';
        //
        const analyticsId = analytics('USER_CHECK_PERMISSION_FAIL', {
          reason,
          user: userId,
          permission: 'userCheckPerm',
        });

        res.status(400).json(message.fail(reason, analyticsId, true));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('USER_CHECK_PERMISSION_ERROR', {
        error: error.message,
        roles,
        user: userId,
        permission: 'userCheckPerm',
      });

      res.status(400).json(message.fail('Permission denied. Error', analyticsId));
    });
};

export default userCheckPerm;

export const userCanByPerm = async (userId, checkedPermission) => {
  return await User.findById(userId)
    .select('roles')
    .exec()
    .then((doc) => {
      const roles = get(doc, 'roles', []);
      return userCan(roles, checkedPermission);
    })
    .catch((err) => {
      analytics('USER_CHECK_PERMISSION_ERROR', {
        reason: err,
        checkedPermission,
        user: userId,
      });
    });
};


export const userCanByOwner = async (Model, filterId, userRoles, userId, res) => {  //verify if user is owner or is admin
  let admin;
  for (let i = 0; i < userRoles.length; i += 1) {
    if (userRoles[i].includes('admin')) admin = true;
    else admin = false;
  }
  return Model.findOne({ _id: filterId })
    .then((doc) => {
      if (doc) {
        if ((userId == doc.owner) || (admin === true)) {
          return message.success('Success', doc);
        } else {
          analytics('ERROR_YOU_ARE_NOT_AN_OWNER', {
            user: userId,
            owner: doc.owner,
          })
          return res.status(400).json(message.fail('You are not allowed to do this. You are not an owner. Error.'));
        }
      }
      else
      {
        analytics('OWNER_NOT_FOUND_FAIL', {
          user: userId,
          owner: doc.owner,
        })
        return res.status(400).json(message.fail('Owner not found. Fail.'));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('OWNER_NOT_FOUND_ERROR', {
        error,
        user: userId,
        controller: 'userCheckPerm',
      });
      return res.status(400).json(message.fail('Owner not found. Error.', analyticsId));
    });
};
