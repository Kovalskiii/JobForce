import JobProposal from '../../job/jobProposalModel.js';
import analytics from '../../../analytics/controllers/analytics.js';
import message from '../../../utils/messages.js';

export default async function addToJobProposalQuery({ performerProposalId, jobProposalId, userId, res }) {
  return JobProposal.findOneAndUpdate(
    { _id: jobProposalId },
    { $addToSet: { performerProposals: performerProposalId } },
    { runValidators: true },
  )
    .exec()
    .then((doc) => {
      if (doc) {
        analytics('PERFORMER_PROPOSAL_ADD_TO_JOB_PROPOSAL_SUCCESS', {
          user: userId,
          performerProposalId: performerProposalId,
          jobProposalId: jobProposalId,
        });
        return message.success('Performer proposal added to job proposal. Success', doc);
      } else {
        const analyticsId = analytics('PERFORMER_PROPOSAL_ADD_TO_JOB_PROPOSAL_FAIL', {
          performerProposalId: performerProposalId,
          jobProposalId: jobProposalId,
          query: 'addToJobProposalQuery',
          user: userId,
        });
        res.status(404).json(message.fail('Performer proposal add to job proposal. Fail', analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('PERFORMER_PROPOSAL_ADD_TO_JOB_PROPOSAL_ERROR', {
        error: error.message,
        performerProposalId: performerProposalId,
        jobProposalId: jobProposalId,
        query: 'addToJobProposalQuery',
        user: userId,
      });
      res.status(400).json(message.fail('Performer proposal add to job proposal failed. Error', analyticsId));
    });
}
