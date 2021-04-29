import sgMail from '@sendgrid/mail';
import message from '../../utils/messages.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailViaSendGrid = (to, subject, emailMessage) => {

  const params = {
    to: [to],
    from: process.env.SG_MAIL_SEND_FROM,
    subject: subject,
    text: emailMessage.text,
    html: emailMessage.html,

  };

  return sgMail.send(params)
    .then((data) => {
      return message.success('Email is sent', data, true);
    })
    .catch((error) => {
      return message.fail('Email is not sent', error, true);
    });
};

export default sendEmailViaSendGrid;

// import message from '../../utils/messages.js';
// import AWS from 'aws-sdk';
//
// const SES_CONFIG = {                                 // update the AWS.Config global configuration object
//   accessKeyId: process.env.AWS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_KEY,
//   region: process.env.AWS_REGION,
// };
// const ses = new AWS.SES(SES_CONFIG);
//
// const sendEmailViaSendGrid = (to, subject, emailMessage) => {
//
//   const params = {
//     Destination: {
//       ToAddresses: [to],
//     },
//     Message: {
//       Body: {
//         Html: {
//           Charset: 'UTF-8',
//           Data: emailMessage.html,
//         },
//         Text: {
//           Charset: 'UTF-8',
//           Data: emailMessage.text,
//         },
//       },
//       Subject: {
//         Charset: 'UTF-8',
//         Data: subject,
//       },
//     },
//     ReturnPath: process.env.AWS_SES_FROM,
//     Source: process.env.AWS_SES_FROM,
//   };
//
//   const sendEmail = ses.sendEmail(params).promise();
//
//   return sendEmail
//     .then((data) => {
//       return message.success('Email is sent', data, true);
//     })
//     .catch((error) => {
//       return message.fail('Email is not sent', error, true);
//     });
// };
//
// export default sendEmailViaSendGrid;

