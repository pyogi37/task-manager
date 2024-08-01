const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/.env" });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER_NAME,
    pass: process.env.GMAIL_APP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Error verifying transporter:', error);
  } else {
    console.log('Server is ready to take our messages:', success);
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'pyogi37@gmail.com',
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
