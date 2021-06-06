const nodemailer = require('nodemailer');

const mailBody = {
  senderName: 'Elon Aseneka',
  senderAddress: 'elonsantos63@gmail.com',
  recipients: ['elonsantos63@gmail.com'],
  subject: 'Hello',
  plainText: 'Hello World',
  htmlBody: '<b>Hello world</b>',
};

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async (mailBody) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PWD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${mailBody.senderAddress}`, // sender address
    to: mailBody.recipients.join(), // list of receivers
    subject: mailBody.subject, // Subject line
    text: mailBody.plainText, // plain text body
    html: mailBody.htmlBody, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

module.exports = {
  sendMail,
  mailBody
};
