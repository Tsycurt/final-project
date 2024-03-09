const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: {
      name: "Travel Now",
      address: process.env.user,
    },
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
