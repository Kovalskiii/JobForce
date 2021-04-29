import { Router } from 'express';
import serviceHeader from '../../utils/serviceHeader.js';
import userCheckAuth from '../../user/middlewares/userCheckAuth.js';
import userCheckPerm from '../../permission/userCheckPerm.js';
import jobProposalCreate from './controllers/jobProposalCreate.js'
import jobProposalDeleteById from './controllers/jobProposalDeleteById.js';
import jobProposalGetById from './controllers/jobProposalGetById.js';
import jobProposalGetAll from './controllers/jobProposalGetAll.js';
import jobProposalUpdateById from './controllers/jobProposalUpdateById.js';
import jobProposalSearchBySubject from './controllers/jobProposalSearchBySubject.js';
import jobProposalApprovePerformerProposal from "./controllers/jobProposalApprovePerformerProposal.js";


const router = Router();

router.post(
  '/proposal/create',
  serviceHeader('jobProposalCreate'),
  userCheckAuth,
  userCheckPerm('proposal.create'),
  jobProposalCreate,
);

router.get(
  '/proposal/getAll',
  serviceHeader('jobProposalGetAll'),
  userCheckAuth,
  userCheckPerm('proposal.get.all'),
  jobProposalGetAll,
);

router.delete(
  '/proposal/:jobProposalId',
  serviceHeader('jobProposalDeleteById'),
  userCheckAuth,
  userCheckPerm('proposal.delete'),
  jobProposalDeleteById,
);

router.get(
  '/proposal/:jobProposalId',
  serviceHeader('jobProposalGetById'),
  userCheckAuth,
  userCheckPerm('proposal.get.all'),
  jobProposalGetById,
);

router.patch(
  '/proposal/update/:jobProposalId',
  serviceHeader('jobProposalUpdateById'),
  userCheckAuth,
  userCheckPerm('proposal.update'),
  jobProposalUpdateById,
);

router.post(
  '/proposal/searchBySubject',
  serviceHeader('jobProposalSearchBySubject'),
  userCheckAuth,
  userCheckPerm('proposal.search'),
  jobProposalSearchBySubject,
);

router.patch(
  '/proposal/:jobProposalId/approve/performer/:performerProposalId',
  serviceHeader('jobProposalApprovePerformerProposal'),
  userCheckAuth,
  userCheckPerm('proposal.update'),
  jobProposalApprovePerformerProposal,
);


export default router;
