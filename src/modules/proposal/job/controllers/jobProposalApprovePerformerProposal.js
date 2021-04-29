import message from '../../../utils/messages.js';
import analytics from '../../../analytics/controllers/analytics.js';
import pkg from 'lodash';

const { get } = pkg;
import JobProposal from '../../job/jobProposalModel.js';
import { userCanByOwner } from "../../../permission/userCheckPerm.js";
import findPerformerProposalOwnerQuery from "../../performer/queries/findPerformerProposalOwnerQuery.js";
import approvePerformerProposalQuery from "../queries/approvePerformerProposalQuery.js";
import changeJobProposalStatusQuery from "../../job/queries/changeJobProposalStatusQuery.js";
import sendEmailToApprovedPerformerQuery from "../queries/sendEmailToApprovedPerformerQuery.js";

//This controller change status to performerProposal on approved: true or false,
// Change status to job proposal on in work or opened,
// and send email to performer proposal approved user.

export default async function jobProposalApprovePerformerProposal(req, res) {

  const userId = get(req, 'userData.userId', null);
  const jobProposalId = get(req, 'params.jobProposalId');
  const performerProposalId = get(req, 'params.performerProposalId');
  const roles = get(req, 'userData.roles', null);
  const performPropStatus = get(req, 'body.approved', false);
  let jobProposalStatus;
  let Email;
  let firstName;
  let lastName;

  (performPropStatus === true) ? (jobProposalStatus = 'in work') : (jobProposalStatus = 'opened');


  const userCanByOwnerResult = await userCanByOwner(JobProposal, jobProposalId, roles, userId, res); //check owner permission
  const findPerformerProposalOwnerResult = await findPerformerProposalOwnerQuery(performerProposalId, res);  //find email, firstName and lastName of proposal owner


  if (userCanByOwnerResult?.success && findPerformerProposalOwnerResult?.success) {   //check owner permission

    Email = findPerformerProposalOwnerResult.payload.owner.email;
    firstName = findPerformerProposalOwnerResult.payload.owner.firstName;
    lastName = findPerformerProposalOwnerResult.payload.owner.lastName;

    const approvePerformerProposal = await approvePerformerProposalQuery(performerProposalId, performPropStatus, userId, res) //approve proposal (change status to approved: false / true)

    const changeJobProposalStatus = await changeJobProposalStatusQuery(jobProposalId, jobProposalStatus, userId, res)  //change jop proposal status

    if (performPropStatus === true) {
      const sendEmailToApprovedPerformer = await sendEmailToApprovedPerformerQuery(jobProposalId, Email, firstName, lastName, userId, res)
        .then((result) => result.payload)
        .catch((error) => {
          const analyticsId = analytics('PERFORMER_PROPOSAL_APPROVE_SEND_EMAIL_ERROR', {
            reason: error,
            jobProposalId: jobProposalId,
            email: Email,
            user: userId,
            controller: 'jobProposalApprovePerformerProposal',
            query: 'sendEmailToApprovedPerformerQuery',
          });

          res.status(400).json(message.fail('Mail send. Error.', analyticsId));
        });

      if (approvePerformerProposal?.success && changeJobProposalStatus?.success && sendEmailToApprovedPerformer?.success) {
        res.status(200).json(message.success('Approve performer proposal, send email and change job proposal status. Success.', jobProposalId));
      }
    } else if (approvePerformerProposal?.success && changeJobProposalStatus?.success) {
      res.status(200).json(message.success('Approve performer proposal and change job proposal status. Success.', jobProposalId));
    }
  }
}

