import nodemailer from "nodemailer";

export const sendEmail = async ({email, subject, message}) => {
  const transorter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth:{
      user: process.env.SENDER_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const options = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: subject,
    text: message
  }

  await transorter.sendMail(options);

};