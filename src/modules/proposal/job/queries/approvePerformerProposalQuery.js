import analytics from "../../../analytics/controllers/analytics.js";
import message from "../../../utils/messages.js";
import PerformerProposal from '../../performer/performerProposalModel.js'

export default async function approvePerformerProposalQuery(performerProposalId, performPropStatus, userId, res) {

  return PerformerProposal.updateOne({ _id: performerProposalId }, { $set: { approved: performPropStatus }, }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        //
        analytics('APPROVE_PERFORMER_PROPOSAL_SUCCESS', {
          performerProposalId: performerProposalId,
          user: userId,
          approved: performPropStatus,
        });
        return message.success('Approve performer proposal. Success.');
      } else {
        const reason = 'Job proposal not found.';
        const analyticsId = analytics('APPROVE_PERFORMER_PROPOSAL_FAIL', {
          reason,
          approved: performPropStatus,
          performerProposalId: performerProposalId,
          user: userId,
          query: 'approvePerformerProposalQuery',
        });
        return res.status(404).json(message.fail('Performer proposal not found. Fail.', analyticsId));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('APPROVE_PERFORMER_PROPOSAL_ERROR', {
        error,
        approved: performPropStatus,
        performerProposalId: performerProposalId,
        user: userId,
        query: 'approvePerformerProposalQuery',
      });

      return res.status(400).json(message.fail('Approve performer proposal. Error.', analyticsId));
    });

}
