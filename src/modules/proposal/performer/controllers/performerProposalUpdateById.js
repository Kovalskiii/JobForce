import PerformerProposal from '../performerProposalModel.js'
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';
import { userCanByOwner } from '../../../permission/userCheckPerm.js';

const { get } = pkg;

export default async function performerProposalUpdateById(req, res) {
  const userId = get(req, 'userData.userId');
  const performerProposalId = get(req, 'params.performerProposalId');
  const roles = get(req, 'userData.roles', null);

  const userCanByOwnerResult = await userCanByOwner(PerformerProposal, performerProposalId, roles, userId, res); //check owner permission

  if (userCanByOwnerResult.success) {   //check owner permission

    PerformerProposal.updateOne({ _id: performerProposalId }, { $set: req.body }, { runValidators: true })
      .exec()
      .then((doc) => {

        if (doc.n) {
          //
          analytics('PERFORMER_PROPOSAL_UPDATE_BY_ID_SUCCESS', {
            performerProposalId: performerProposalId,
            user: userId,
          });
          res.status(200).json(message.success('Performer proposal update. Success.'));
        } else {
          const reason = 'Performer proposal not found.';
          const analyticsId = analytics('PERFORMER_PROPOSAL_UPDATE_BY_ID_FAIL', {
            reason,
            body: req.body,
            performerProposalId: performerProposalId,
            user: userId,
            controller: 'performerProposalUpdateById',
          });
          res.status(404).json(message.fail('Performer proposal not found. Fail.', analyticsId));
        }
      })
      .catch((error) => {
        //
        const analyticsId = analytics('PERFORMER_PROPOSAL_UPDATE_BY_ID_ERROR', {
          error,
          body: req.body,
          performerProposalId: performerProposalId,
          user: userId,
          controller: 'performerProposalUpdateById',
        });

        res.status(400).json(message.fail('Performer proposals update. Error.', analyticsId));
      });
  }
}
