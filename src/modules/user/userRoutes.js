import { Router } from 'express';
import serviceHeader from '../utils/serviceHeader.js';
import userCheckAuth from './middlewares/userCheckAuth.js';
import userCheckPerm from '../permission/userCheckPerm.js';
import userRegister from './controllers/userControllerRegister.js';
import userLogin from './controllers/userControllerLogin.js';
import userDeleteById from './controllers/userControllerDeleteById.js';
import userDeleteByEmail from './controllers/userControllerDeleteByEmail.js';
import userGetAll from './controllers/userControllerGetAll.js';
import userGetByEmail from './controllers/userControllerGetByEmail.js';
import userGetById from './controllers/userControllerGetById.js';
import userGetCountryList from './controllers/userControllerGetCountryList.js'
import userSettingsUpdatePassword from './controllers/userControllerSettingsUpdatePassword.js';
import userSettingsUpdateProfile from './controllers/userControllerSettingsUpdateProfile.js';
import userEmailConfirm from './controllers/mailConfirm/userControllerEmailConfirm.js';
import userCheckEmailSendPerm from '../permission/userCheckEmailSendPerm.js';
import userVerifyEmailSend from './controllers/mailConfirm/userVerifyEmailSend.js';
import userPasswordIsValidResetLink from './controllers/resetPassword/userControllerIsValidResetLink.js';
import userPasswordResetNew from './controllers/resetPassword/userControllerPasswordResetNew.js';
import userPasswordResetRequest from './controllers/resetPassword/userControllerPasswordResetRequest.js';
import userRatingCounting from './controllers/userRating/userRatingController.js';

const router = Router();

router.post('/', serviceHeader('userRegister'), userRegister);

router.post('/login', serviceHeader('userLogin'), userLogin);

router.get('/country', serviceHeader('userGetCountryList'), userGetCountryList);

router.delete(
  '/:userId',
  serviceHeader('userDeleteById'),
  userCheckAuth,
  userCheckPerm('user.delete.admin'),
  userDeleteById,
);

router.delete(
  '/email/:email',
  serviceHeader('userDeleteByEmail'),
  userCheckAuth,
  userCheckPerm('user.delete.admin'),
  userDeleteByEmail,
);

router.get(
  '/',
  serviceHeader('userGetAll'),
  userCheckAuth,
  userCheckPerm('user.get.admin'),
  userGetAll,
);

router.get(
  '/email/:email',
  serviceHeader('userGetByEmail'),
  userCheckAuth,
  userCheckPerm('user.get.admin'),
  userGetByEmail,
);

router.get(
  '/:userId',
  serviceHeader('userGetById'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userGetById,
);

router.patch(
  '/settings/password',
  serviceHeader('userSettingsUpdatePassword'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userSettingsUpdatePassword,
);

router.patch(
  '/settings/profile',
  serviceHeader('userSettingsUpdateProfile'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userSettingsUpdateProfile,
);

//mailConfirm
router.get(
  '/verify/email/:userId/:hash',
  serviceHeader('userEmailConfirm'),
  userEmailConfirm,
);

router.post(
  '/verify/email/send',
  serviceHeader('userVerifyEmailSend'),
  userCheckAuth,
  userCheckPerm('user.auth'),
  userCheckEmailSendPerm,
  userVerifyEmailSend,
);

//resetPassword
router.post(
  '/password/reset/valid',
  serviceHeader('userPasswordIsValidResetLink'),
  userPasswordIsValidResetLink,
);

router.post(
  '/password/reset/new',
  serviceHeader('userPasswordResetNew'),
  userPasswordResetNew,
);

router.post(
  '/password/reset/request',
  serviceHeader('userPasswordResetRequest'),
  userPasswordResetRequest,
);

//rating
router.patch(
  '/rating/:userId',
  serviceHeader('userRatingController'),
  userCheckAuth,
  userCheckPerm('user.rating'),
  userRatingCounting,
);

export default router;
