import PerformerProposal from '../performerProposalModel.js'
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;

export default async function performerProposalGetById(req, res) {
  const userId = get(req, 'userData.userId', null);
  const performerProposalId = get(req, 'params.performerProposalId');

  PerformerProposal.findById(performerProposalId)
    .select('-__v -updatedAt -createdAt')
    .exec()
    .then((doc) => {
      if (doc) {
        analytics('PERFORMER_PROPOSAL_GET_BY_ID_SUCCESS', {
          user: userId,
        });

        res.status(200).json(message.success('Get performer proposal by id. Success', doc));
      } else {
        //
        const analyticsId = analytics('PERFORMER_PROPOSAL_GET_BY_ID_FAIL', {
          user: userId,
          performerProposalId: performerProposalId,
          controller: 'performerProposalGetById',
        });
        res.status(404).json(message.fail('No performer proposal for provided id. Fail.', analyticsId));
      }
    })
    .catch((err) => {
      //
      analytics('PERFORMER_PROPOSAL_GET_BY_ID_ERROR', {
        user: userId,
        performerProposalId: performerProposalId,
        reason: err,
        controller: 'performerProposalGetById',
      });

      res.status(400).json(message.fail('Get performer proposal by id. Error.', err));
    });
}
