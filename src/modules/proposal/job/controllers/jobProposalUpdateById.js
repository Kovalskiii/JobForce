import JobProposal from '../jobProposalModel.js'
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;
import { userCanByOwner } from '../../../permission/userCheckPerm.js';


export default async function jobProposalUpdateById(req, res) {
  const userId = get(req, 'userData.userId');
  const jobProposalId = get(req, 'params.jobProposalId');
  const roles = get(req, 'userData.roles', null);

  const userCanByOwnerResult = await userCanByOwner(JobProposal, jobProposalId, roles, userId, res); //check owner permission

  if (userCanByOwnerResult.success) {   //check owner permission

    JobProposal.updateOne({ _id: jobProposalId }, { $set: req.body }, { runValidators: true })
      .exec()
      .then((doc) => {
        if (doc.n) {
          //
          analytics('JOB_PROPOSAL_UPDATE_BY_ID_SUCCESS', {
            jobProposalId: jobProposalId,
            user: userId,
          });
          res.status(200).json(message.success('Job proposal update. Success.'));
        } else {
          const reason = 'Job proposal not found.';
          const analyticsId = analytics('JOB_PROPOSAL_UPDATE_BY_ID_FAIL', {
            reason,
            body: req.body,
            jobProposalId: jobProposalId,
            user: userId,
            controller: 'jobProposalUpdateById',
          });
          res.status(404).json(message.fail('Job proposal not found. Fail.', analyticsId));
        }
      })
      .catch((error) => {
        //
        const analyticsId = analytics('JOB_PROPOSAL_UPDATE_BY_ID_ERROR', {
          error,
          body: req.body,
          jobProposalId: jobProposalId,
          user: userId,
          controller: 'jobProposalUpdateById',
        });

        res.status(400).json(message.fail('Job proposals update. Error.', analyticsId));
      });
  }
}
