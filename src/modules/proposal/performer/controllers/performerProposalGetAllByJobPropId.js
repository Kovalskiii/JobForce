import PerformerProposal from '../performerProposalModel.js'
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;

export default async function performerProposalGetAllByJobPropId(req, res) {
  const userId = get(req, 'userData.userId', null);
  const jobProposalId = get(req, 'params.jobProposalId');

  PerformerProposal.find({ jobProposalId: jobProposalId })
    .select('-__v -createdAt -updatedAt')
    .populate({
      path: 'owner',
      select: 'name rating countryName countryCode phone',
    })
    .exec()
    .then((docs) => {
      if (docs.length) {
        analytics('PERFORMER_PROPOSAL_GET_ALL_LIST_SUCCESS', {
          user: userId,
        });

        res.status(200).json(message.success('Get all performer proposals. Success.', docs));
      } else {
        //
        const analyticsId = analytics('PERFORMER_PROPOSAL_GET_ALL_LIST_FAIL', {
          user: userId,
          controller: 'performerProposalGetAllByJobPropId',
        });
        res.status(404).json(message.fail('No performer proposals. Fail.', analyticsId));
      }
    })
    .catch((err) => {
      //
      analytics('PERFORMER_PROPOSAL_GET_ALL_LIST_ERROR', {
        user: userId,
        reason: err,
        controller: 'performerProposalGetAllByJobPropId',
      });

      res.status(400).json(message.fail('Get all performer proposals. Error.', err));
    });
}
