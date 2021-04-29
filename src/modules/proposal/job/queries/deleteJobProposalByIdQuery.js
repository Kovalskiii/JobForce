import JobProposal from '../jobProposalModel.js';
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';


export default async function deleteJobProposalByIdQuery({ jobProposalId, userId, res }) {

  return JobProposal.deleteOne({ _id: jobProposalId })
    .exec()
    .then((doc) => {
      if (doc.n) {
        analytics('JOB_PROPOSAL_DELETE_SUCCESS', {
          jobProposalId: jobProposalId,
          user: userId,
        });

        return message.success('Job Proposal deleted. Success.');
      } else {
        const reason = 'Job Proposal not found';
        const analyticsId = analytics('JOB_PROPOSAL_DELETE_FAIL', {
          reason: reason,
          jobProposalId: jobProposalId,
          user: userId,
          query: 'deleteJobProposalByIdQuery',
        });

        return res.status(404).json(message.fail('Job Proposal not found. Fail.', analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('JOB_PROPOSAL_DELETE_ERROR', {
        reason: error,
        jobProposalId: jobProposalId,
        user: userId,
        query: 'deleteJobProposalByIdQuery',
      });

      return res.status(400).json(message.fail('Job Proposal delete error. Error.', analyticsId));
    });
}
