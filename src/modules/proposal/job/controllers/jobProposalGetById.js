import JobProposal from '../jobProposalModel.js'
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';

const { get } = pkg;

export default async function jobProposalGetById(req, res) {
  const userId = get(req, 'userData.userId', null);
  const jobProposalId = get(req, 'params.jobProposalId');

  JobProposal.findById(jobProposalId)
    .select('-__v -updatedAt -createdAt')
    .populate({
      path: 'performerProposals',
      populate: [{
        path: 'owner',
        select: 'name rating countryName countryCode phone'
      }]
    })

    .exec()
    .then((doc) => {
      if (doc) {
        analytics('JOB_PROPOSAL_GET_BY_ID_SUCCESS', {
          user: userId,
        });

        res.status(200).json(message.success('Get job proposal by id. Success', doc));
      } else {
        //
        const analyticsId = analytics('JOB_PROPOSAL_GET_BY_ID_FAIL', {
          user: userId,
          jobProposalId: jobProposalId,
          controller: 'jobProposalGetById',
        });
        res.status(404).json(message.fail('No job proposal for provided id', analyticsId));
      }
    })
    .catch((err) => {
      //
      analytics('JOB_PROPOSAL_GET_BY_ID_ERROR', {
        user: userId,
        jobProposalId: jobProposalId,
        reason: err,
        controller: 'jobProposalGetById',
      });

      res.status(400).json(message.fail('Get job proposal by id. ERROR', err));
    });
}
