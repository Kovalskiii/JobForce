import JobProposal from '../jobProposalModel.js'
import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';
const { get } = pkg;

export default async function jobProposalSearchBySubject(req, res) {
  const userId = get(req, 'userData.userId', null);
  const subject = get(req, 'body.subject','');

  JobProposal.find({subject: { $regex: subject, $options: 'i' }})
    .select('-__v -updatedAt -createdAt')
    .exec()
    .then((doc) => {
      if (doc.length) {
        analytics('JOB_PROPOSAL_GET_BY_SUBJECT_SUCCESS', {
          user: userId,
        });

        res.status(200).json(message.success('Get job proposal by subject. Success', doc));
      } else {
        //
        const analyticsId = analytics('JOB_PROPOSAL_GET_BY_SUBJECT_FAIL', {
          user: userId,
          subject: subject,
          controller: 'jobProposalSearchBySubject',
        });
        res.status(404).json(message.fail('No job proposal for provided subject', analyticsId));
      }
    })
    .catch((err) => {
      //
      analytics('JOB_PROPOSAL_GET_BY_SUBJECT_ERROR', {
        user: userId,
        subject: subject,
        reason: err,
        controller: 'jobProposalSearchBySubject',
      });

      res.status(400).json(message.fail('Get job proposal by subject. ERROR', err));
    });
}
