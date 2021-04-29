import JobProposal from '../jobProposalModel.js'
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;

export default async function jobProposalGetAll(req, res) {
  const userId = get(req, 'userData.userId', null);

  JobProposal.find()
    .select('-__v -updatedAt -createdAt')
    .populate({
      path: 'performerProposals',
      populate: [{
        path: 'owner',
        select: 'name rating countryName countryCode phone'
      }]
    })
    .then((docs) => {
      if (docs.length) {
        analytics('JOB_PROPOSAL_GET_ALL_LIST_SUCCESS', {
          user: userId,
        });

        res.status(200).json(message.success('Get all job proposals. Success.', docs));
      } else {
        //
        const analyticsId = analytics('JOB_PROPOSAL_GET_ALL_LIST_FAIL', {
          user: userId,
          controller: 'jobProposalGetAll',
        });
        res.status(404).json(message.fail('No job proposals. Fail.', analyticsId));
      }
    })
    .catch((err) => {
      //
      analytics('JOB_PROPOSAL_GET_ALL_LIST_ERROR', {
        user: userId,
        reason: err,
      });

      res.status(400).json(message.fail('Get all job proposals. Error.', err));
    });
}
