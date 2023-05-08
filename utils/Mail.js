import nodemailer from "nodemailer";
import { EmailTemplate } from "./EmailTemplate.js";
import { ForgetPasswordTemp } from "./ForgetPasswordTemp.js";

const mailTransport = async (email, userName, id, OTP) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USER_NAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  // send mail with defined transport object
  if (!OTP) {
    await transporter
      .sendMail({
        from: process.env.MAILTRAP_USER_NAME,
        to: email,
        subject: "Verify Your Email Account",
        html: EmailTemplate(userName, id),
      })
      .then((done) => {
        console.log(done);
      });
  }

  if (OTP) {
    await transporter
      .sendMail({
        from: process.env.MAILTRAP_USER_NAME,
        to: email,
        subject: "Reset Your Password",
        html: ForgetPasswordTemp(userName, OTP),
      })
      .then((done) => {
        console.log(done);
      });
  }
};

export { mailTransport };
