import sendEmailViaSendGrid from "../../../user/helpers/sendEmailViaSendGrid.js";
import analytics from "../../../analytics/controllers/analytics.js";
import message from "../../../utils/messages.js";


const emailTemplate = (host, firstName, lastName, link) => {
  return {
    html: `Hi ${firstName} ${lastName},<br/>
          You left a request for job at <a href=${host}>${host}</a>
          <br/><br/>
          Your request was approved.
          Please, verify your proposal status <a href=${link}>click here</a>
          <br/><br/>
          Thanks,<br/>
          Your friends at JobForce`,
    text: `Hi ${firstName} ${lastName},\nYou left a request for job at ${host}\n\nYour request was approved. Please, verify your proposal status click the link below\n${link}\n\nThanks,\nYour friends at JobForce`,
  };
};


export default async function sendEmailToApprovedPerformerQuery(jobProposalId, Email, firstName, lastName, userId, res) {
  const host = process.env.CLIENT_HOST;
  const link = `${host}/dashboard/proposals/${jobProposalId}`;
  const subject = '[JobForce] Proposal approve';
  const email = Email.trim().toLowerCase();


  const mail = await sendEmailViaSendGrid(email, subject, emailTemplate(host, firstName, lastName, link));

  if (mail.success) {
    //
    analytics('PERFORMER_PROPOSAL_APPROVE_SEND_EMAIL_SUCCESS', {
      userId,
      email,
    });

    return message.success('Check mail. Your proposal was approved.', mail);
  } else {
    //
    const reason = 'Mail sender error';
    const analyticsId = analytics('PERFORMER_PROPOSAL_APPROVE_SEND_EMAIL_FAIL', {
      reason: { message: 'Mail sender error', error: mail.payload },
      userId,
      email,
    });

    return res.status(400).json(message.fail(reason, analyticsId));
  }
}
