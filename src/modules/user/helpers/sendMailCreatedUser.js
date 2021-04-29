import sendEmailViaSendGrid from './sendEmailViaSendGrid.js';

export async function sendMailCreatedUser({
  email,
  emailHashConfirmation,
  firstName,
  lastName,
  userId,
}) {
  const host = process.env.CLIENT_HOST;
  const link = `${host}/confirm-email/${userId}/${emailHashConfirmation}`;
  const subject = '[JobForce] Verify your email address';

  const message = {
    html: `Hi ${firstName} ${lastName},<br/>
          You registered at <a href=${host}>${host}</a>
          <br/><br/>
          Please, verify your email address <a href=${link}>click here</a>
          <br/><br/>
          Thanks,<br/>
          Your friends at JobForce`,
    text: `Hi ${firstName} ${lastName},\nYou registered at ${host}\n\nPlease, verify your email address click the link below\n${link}\n\nThanks,\nYour friends at JobForce`,
  };

  return await sendEmailViaSendGrid(email, subject, message);
}
