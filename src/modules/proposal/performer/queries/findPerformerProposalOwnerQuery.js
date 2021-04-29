import PerformerProposal from "../performerProposalModel.js";
import message from "../../../utils/messages.js";
import analytics from "../../../analytics/controllers/analytics.js";

export default async function findPerformerProposalOwnerQuery(performerProposalId, res) {

  return PerformerProposal.findOne({ _id: performerProposalId })
    .select('-__v -updatedAt -createdAt')
    .populate({
      path: 'owner',
      select: 'firstName lastName email'
    })
    .exec()
    .then((doc) => {
      //
      if (doc) {
        return message.success('Performer proposal found. Success', doc);
      } else {
        const reason = 'Performer proposal not found.';
        const analyticsId = analytics('FIND_PERFORMER_PROPOSAL_OWNER_FAIL', {
          reason,
          performerProposalId: performerProposalId,
          query: 'findPerformerProposalQuery',
        });
        return res.status(404).json(message.fail('Performer proposal not found. Fail.', analyticsId));
      }
    })
    .catch((error) => {
      const analyticsId = analytics('FIND_PERFORMER_PROPOSAL_OWNER_ERROR', {
        error,
        performerProposalId: performerProposalId,
        query: 'findPerformerProposalQuery',
      });
      return res.status(404).json(message.fail('Find performer proposal. Fail.', analyticsId));
    })
}
