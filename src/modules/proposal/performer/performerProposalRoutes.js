import { Router } from 'express';
import serviceHeader from '../../utils/serviceHeader.js';
import userCheckAuth from '../../user/middlewares/userCheckAuth.js';
import userCheckPerm from '../../permission/userCheckPerm.js';
import performerProposalCreateAndAddToJobProposal from './controllers/performerProposalCreateAndAddToJobProposal.js';
import performerProposalGetById from './controllers/performerProposalGetById.js';
import performerProposalGetAllByJobPropId from './controllers/performerProposalGetAllByJobPropId.js';
import performerProposalUpdateById from './controllers/performerProposalUpdateById.js';
import performerProposalDeleteById from "./controllers/performerProposalDeleteById.js";


const router = Router();

router.post(
  '/proposal/create/:jobProposalId',
  serviceHeader('performerProposalCreateAndAddToJobProposal'),
  userCheckAuth,
  userCheckPerm('proposal.create'),
  performerProposalCreateAndAddToJobProposal,
);

router.delete(
  '/proposal/:performerProposalId/job/proposal/:jobProposalId',
  serviceHeader('performerProposalDeleteById'),
  userCheckAuth,
  userCheckPerm('proposal.delete'),
  performerProposalDeleteById,
);

router.get(
  '/proposal/getAll/:jobProposalId',
  serviceHeader('performerProposalGetAllByJobPropId'),
  userCheckAuth,
  userCheckPerm('proposal.get.all'),
  performerProposalGetAllByJobPropId,
);

router.get(
  '/proposal/:performerProposalId',
  serviceHeader('performerProposalGetById'),
  userCheckAuth,
  userCheckPerm('proposal.get.all'),
  performerProposalGetById,
);

router.patch(
  '/proposal/update/:performerProposalId',
  serviceHeader('performerProposalUpdateById'),
  userCheckAuth,
  userCheckPerm('proposal.update'),
  performerProposalUpdateById,
);

export default router;
