import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;
import deleteAllPerformerProposalsByJobProposalIdQuery
  from '../queries/deleteAllPerformerProposalsByJobProposalIdQuery.js';
import deleteJobProposalByIdQuery from '../queries/deleteJobProposalByIdQuery.js';
import { userCanByOwner } from '../../../permission/userCheckPerm.js';
import JobProposal from '../jobProposalModel.js';


export default async function jobProposalDeleteById(req, res) {
  const userId = get(req, 'userData.userId', null);
  const jobProposalId = get(req, 'params.jobProposalId');
  const roles = get(req, 'userData.roles', null);

  const userCanByOwnerResult = await userCanByOwner(JobProposal, jobProposalId, roles, userId, res); //check owner permission

  if (userCanByOwnerResult?.success) {   //check owner permission

    const deleteAllPerformerProposalsByJobProposalIdResult = await deleteAllPerformerProposalsByJobProposalIdQuery({ jobProposalId, userId, res });

    if(deleteAllPerformerProposalsByJobProposalIdResult?.success){
      const deleteJobProposalByIdResult = await deleteJobProposalByIdQuery({ jobProposalId, userId, res });

      if (deleteAllPerformerProposalsByJobProposalIdResult?.success && deleteJobProposalByIdResult?.success)
        res.status(200).json(message.success('Delete job proposal by Id and all related performer proposals. Success.', jobProposalId));
    }
  }
}

