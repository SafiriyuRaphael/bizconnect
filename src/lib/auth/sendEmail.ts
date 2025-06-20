// lib/sendEmail.ts
import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use smtp.ethereal.email for testing
    auth: {
      user: process.env.EMAIL_USER, // your Gmail or SMTP user
      pass: process.env.EMAIL_PASS, // your Gmail App Password
    },
  });

  const mailOptions = {
    from: `"Biz Connect" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✉️  Email sent:", info.messageId);
};
