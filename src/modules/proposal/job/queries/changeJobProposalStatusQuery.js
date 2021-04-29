import JobProposal from "../jobProposalModel.js";
import analytics from "../../../analytics/controllers/analytics.js";
import message from "../../../utils/messages.js";

export default async function changeJobProposalStatusQuery(jobProposalId, jobProposalStatus, userId, res) {
  
  return JobProposal.updateOne({ _id: jobProposalId }, { $set: { status: jobProposalStatus } }, { runValidators: true })
    .exec()
    .then((doc) => {
      if (doc.n) {
        //
        analytics('JOB_PROPOSAL_CHANGE_STATUS_SUCCESS', {
          jobProposalId: jobProposalId,
          user: userId,
          jobProposalStatus: jobProposalStatus,
        });
        return message.success('Job proposal change status by Id. Success.');
      } else {
        const reason = 'Job proposal not found.';
        const analyticsId = analytics('JOB_PROPOSAL_CHANGE_STATUS_BY_ID_FAIL', {
          reason,
          jobProposalStatus: jobProposalStatus,
          jobProposalId: jobProposalId,
          user: userId,
          query: 'changeJobProposalStatusQuery',
        });
        return res.status(404).json(message.fail('Job proposal not found. Fail.', analyticsId));
      }
    })
    .catch((error) => {
      //
      const analyticsId = analytics('JOB_PROPOSAL_CHANGE_STATUS_BY_ID_ERROR', {
        error,
        jobProposalStatus: jobProposalStatus,
        jobProposalId: jobProposalId,
        user: userId,
        query: 'changeJobProposalStatusQuery',
      });

      return res.status(400).json(message.fail('Job proposals change status by Id. Error.', analyticsId));
    });

}
