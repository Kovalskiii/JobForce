import mongoose from 'mongoose';
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import JobProposal from '../jobProposalModel.js';
import pkg from 'lodash';
const { get } = pkg;


export default async function jobProposalCreate(req, res) {

  const jobProposalId = new mongoose.Types.ObjectId();
  const userId = get(req, 'userData.userId', null);
  const subject = get(req, 'body.subject', '');
  const type = get(req, 'body.type', '');
  const description = get(req, 'body.description', '');
  const startPrice = get(req, 'body.startPrice', '');
  const countryName = get(req, 'body.countryName', '');
  const city = get(req, 'body.city', '');
  const state = get(req, 'body.state', '');

  const jobProposal = new JobProposal({
    _id: jobProposalId,
    subject,
    type,
    description,
    status: 'opened',
    startPrice,
    countryName,
    city,
    state,
    owner: userId,
  });

  const payload = {
    jobProposalId: jobProposalId,
  };

  jobProposal
    .save()
    .then(() => {
      analytics('JOB_PROPOSAL_CREATE_SUCCESS', {
        user: userId,
        jobProposalId: jobProposalId,
      });
      res.status(200).json(message.success('Job proposal created. Success', payload));
    })
    .catch((error) => {
      const analyticsId = analytics('JOB_PROPOSAL_CREATE_ERROR', {
        error: error.message,
        user: userId,
        controller: 'jobProposalCreate',
      });
      res.status(400).json(message.fail('Creating Job proposal failed. Error', analyticsId));
    });
}
