import PerformerProposal from '../../performer/performerProposalModel.js'
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';

export default async function deleteAllPerformerProposalsByJobProposalIdQuery({ jobProposalId, userId, res }) {

  return PerformerProposal.deleteMany({ jobProposalId: jobProposalId },)
    .exec()
    .then((doc) => {
      if (doc) {
        analytics('PERFORMERS_PROPOSALS_DELETE_SUCCESS', {
          jobProposalId: jobProposalId,
          user: userId,
        });

        return message.success('Performers proposals deleted. Success.');
      } else {
        const reason = 'Performers proposals not found';
        const analyticsId = analytics('PERFORMERS_PROPOSALS_DELETE_FAIL', {
          reason: reason,
          jobProposalId: jobProposalId,
          user: userId,
          query: 'deleteAllPerformerProposalsByJobProposalIdQuery',
        });

        return res.status(404).json(message.fail('Performers proposals not found. Fail.', analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('PERFORMERS_PROPOSALS_DELETE_ERROR', {
        reason: error,
        jobProposalId: jobProposalId,
        user: userId,
        query: 'deleteAllPerformerProposalsByJobProposalIdQuery',
      });

      return res.status(400).json(message.fail('Performers proposals delete. Error.', analyticsId));
    });

}
