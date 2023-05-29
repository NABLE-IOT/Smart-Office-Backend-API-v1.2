import nodemailer from "nodemailer";
import { AlarmTemplate } from "./AlarmTemplate.js";

const mailTransport = async (
  email,
  deviceName,
  location,
  deviceData,
  timestamp,
  unit,
  alarmType
) => {
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

  await transporter
    .sendMail({
      from: process.env.MAILTRAP_USER_NAME,
      to: email,
      subject: "Smart Office Alert",
      html: AlarmTemplate(
        deviceName,
        location,
        deviceData,
        timestamp,
        unit,
        alarmType
      ),
    })
    .then((done) => {
      console.log(done);
    });
};

export { mailTransport };
