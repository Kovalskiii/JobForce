import mongoose from 'mongoose';
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;
import proposalCreateQuery from '../queries/proposalCreateQuery.js';
import addToJobProposalQuery from '../queries/addToJobProposalQuery.js';
import JobProposal from "../../job/jobProposalModel.js";

export default async function performerProposalCreateAndAddToJobProposal(req, res) {

  const performerProposalId = new mongoose.Types.ObjectId();
  const jobProposalId = get(req, 'params.jobProposalId', null);
  const userId = get(req, 'userData.userId', null);
  const description = get(req, 'body.description', '');
  const price = get(req, 'body.price', '');

  const jobProposalFindResult = await jobProposalFind(jobProposalId, userId, res);

  if (jobProposalFindResult?.success && jobProposalFindResult.payload.status === 'opened') {  //You can not create offer when proposal status is: in work
    //
    const proposalCreateResult = await proposalCreateQuery({
      performerProposalId, userId, jobProposalId, description, price, res
    })

    const addToJobProposalResult = await addToJobProposalQuery({ performerProposalId, jobProposalId, userId, res })

    if (proposalCreateResult?.success && addToJobProposalResult?.success) {
      res.status(200).json(message.success('Performer proposal created and added to job proposal. Success', performerProposalId));
    }

  } else {
    analytics('PERFORMER_PROPOSAL_CREATE_AND_ADD_TO_JOB_PROPOSAL_ERROR', {
      user: userId,
      jobProposalId: jobProposalId,
      controller: 'performerProposalCreateAndAddToJobProposal',
    });

    res.status(400).json(message.fail('You can not create offer when proposal status is: in work. Error.'));
  }
}


async function jobProposalFind(jobProposalId, userId, res) {
  return JobProposal.findById(jobProposalId)
    .exec()
    .then((doc) => {
      if (doc) {
        //
        return message.success('Get job proposal by id. Success', doc);
      } else {
        //
        const analyticsId = analytics('JOB_PROPOSAL_GET_BY_ID_FAIL', {
          user: userId,
          jobProposalId: jobProposalId,
          controller: 'performerProposalCreateAndAddToJobProposal',
        });
        return res.status(404).json(message.fail('No job proposal for provided id', analyticsId));
      }
    })
    .catch((err) => {
      //
      analytics('JOB_PROPOSAL_GET_BY_ID_ERROR', {
        user: userId,
        jobProposalId: jobProposalId,
        reason: err,
        controller: 'performerProposalCreateAndAddToJobProposal',
      });

      return res.status(400).json(message.fail('Get job proposal by id. ERROR', err));
    });
}
