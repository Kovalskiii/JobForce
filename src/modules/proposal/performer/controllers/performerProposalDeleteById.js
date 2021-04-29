import PerformerProposal from '../performerProposalModel.js'
import JobProposal from '../../job/jobProposalModel.js'
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';

const { get } = pkg;
import { userCanByOwner } from '../../../permission/userCheckPerm.js';
import findPerformerProposalOwnerQuery from "../queries/findPerformerProposalOwnerQuery.js";

//This controller delete performer proposal by id, update job proposal and update job proposal status to 'opened'

export default async function performerProposalDeleteById(req, res) {

  const userId = get(req, 'userData.userId', null);
  const performerProposalId = get(req, 'params.performerProposalId');
  const jobProposalId = get(req, 'params.jobProposalId');
  const roles = get(req, 'userData.roles', null);
  let jobProposalStatus = 'opened';

  const userCanByOwnerResult = await userCanByOwner(PerformerProposal, performerProposalId, roles, userId, res); //check owner permission

  if (userCanByOwnerResult?.success) {   //check owner permission
    //
    const findPerformerProposalOwnerResult = await findPerformerProposalOwnerQuery(performerProposalId, res);

    (findPerformerProposalOwnerResult.payload.approved === true) ? (jobProposalStatus = 'opened') : (jobProposalStatus = 'in work') ;

    const deletePerformerProposalByIdResult = await deletePerformerProposalById(performerProposalId, userId, res);

    if (deletePerformerProposalByIdResult?.success) {
      //
      const updateJobProposalResult = await updateJobProposal(performerProposalId, jobProposalId, jobProposalStatus, userId, res);

      if (updateJobProposalResult?.success) res.status(200).json(message.success('Performer Proposal deleted and Job Proposal updated. Success.'));
    }
  }
}


async function updateJobProposal(performerProposalId, jobProposalId, jobProposalStatus, userId, res) {
  return JobProposal.findOneAndUpdate(
    { _id: jobProposalId },
    { $pull: { performerProposals: { $in: [performerProposalId] } }, $set: { status: jobProposalStatus } },
    { multi: false },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        //
        analytics('JOB_PROPOSAL_UPDATED_SUCCESS', {
          jobProposalId: jobProposalId,
          performerProposalId: performerProposalId,
          controller: 'performerProposalDeleteById',
        });
        return message.success('Job Proposal is updated. Success.', doc);
        //
      } else {
        const analyticsId = analytics('JOB_PROPOSAL_NOT_FOUND_FAIL', {
          jobProposalId: jobProposalId,
          performerProposalId: performerProposalId,
          user: userId,
          controller: 'performerProposalDeleteById',
        });
        return res.status(400).json(message.fail('No job proposal for provided id. Fail.', analyticsId));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('JOB_PROPOSAL_NOT_FOUND_ERROR', {
        reason: error,
        jobProposalId: jobProposalId,
        performerProposalId: performerProposalId,
        user: userId,
        controller: 'performerProposalDeleteById',
      });
      return res.status(400).json(message.fail('No job proposal for provided id. Job Proposal update error. Error.', analyticsId));
    });
}


async function deletePerformerProposalById(performerProposalId, userId, res) {
  return PerformerProposal.deleteOne({ _id: performerProposalId })
    .exec()
    .then((response) => {
      if (response.n) {
        //
        analytics('PERFORMER_PROPOSAL_DELETE_FROM_DB_SUCCESS', {
          user: userId,
          performerProposalId: performerProposalId,
        });
        return message.success('Performer proposal delete from database. Success', response);
      } else {
        const analyticsId = analytics('PERFORMER_PROPOSAL_NOT_FOUND_FAIL', {
          user: userId,
          performerProposalId: performerProposalId,
          controller: 'performerProposalDeleteById',
        });
        return res.status(400).json(message.fail('Performer proposal not found. Fail.', analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('PERFORMER_PROPOSAL_DELETE_FROM_DB_ERROR', {
        reason: error,
        user: userId,
        performerProposalId: performerProposalId,
        controller: 'performerProposalDeleteById',
      });
      return res.status(400).json(message.fail('Performer proposal delete from database failed. Error', analyticsId));
    });
}
