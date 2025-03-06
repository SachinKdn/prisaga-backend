// import nodemailer from "nodemailer";
import * as nodemailer from 'nodemailer';
import type Mail from "nodemailer/lib/mailer";
import createHttpError from "http-errors";
import { loadConfig } from "../config/config";

loadConfig();

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
        port:587, //default port for SMTP is 587 if secure is false for encrypted email transmission using SMTP secure (SMTPS)
        // port:465, //secure should be true for 465 port no. (NOT RECOMMANDED)
        secure:false,

  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async (mailOptions: Mail.Options): Promise<any> => {
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error: any) {
    createHttpError(500, { message: error.message });
  }
};

export const resetPasswordEmailTemplate = (token = ""): string => `
<html>
  <body>
    <h3>Welcome to the team</h3>
    <p>Click <a href="${process.env.FE_BASE_URL}/resetPassword?token=${token}">here</a> to reset your password</p>
    
    
    <span>${process.env.FE_BASE_URL}/api/user/resetPassword/${token}</span>
  </body>
</html>`;