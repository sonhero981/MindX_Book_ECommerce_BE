const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",

    auth: {
      user: "sonhero981@gmail.com",
      pass: "xccjqfcvhekqzalm",
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
);

const mailOptions = {
  from: "sonhero981@gmail.com",
  to: "gbhalloday@gmail.com",
  subject: "Sending Email using Node.js[nodemailer]",
  text: "This is code: {0}, This code will valid for 60 seconds",
};

const sendMail = options => {
  options = {
    ...options,
    from: "sonhero981@gmail.com",
    subject: "Sending Email using Node.js[nodemailer]",
  };
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log("e: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendMail };
