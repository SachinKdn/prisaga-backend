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
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password</title>
  </head>
  <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <!-- Header Section -->
      <tr>
        <td style="background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); padding: 30px 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; margin: 0; text-align: center; font-size: 24px;">🔐 Password Reset Request</h1>
        </td>
      </tr>

      <!-- Main Content -->
      <tr>
        <td style="padding: 30px 20px;">
          <!-- Welcome Message -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 20px;">Welcome to Prisage Consulting</h2>
            <p style="color: #6c757d; margin: 0; line-height: 1.5;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>
          </div>

          <!-- Reset Button -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.FE_BASE_URL}/createPassword/${token}" 
               style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>

          <!-- Alternative Link -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 14px;">
              If the button above doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #3498db; margin: 0; font-size: 14px; word-break: break-all;">
              ${process.env.FE_BASE_URL}/createPassword/${token}
            </p>
          </div>

          <!-- Security Notice -->
          <div style="background-color: #fff3cd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">
              <span style="color: #856404;">⚠️</span> Security Notice
            </h3>
            <p style="color: #856404; margin: 0; line-height: 1.5; font-size: 14px;">
              This password reset link will expire in 24 hours. If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
        </td>
      </tr>

      <!-- Footer Section -->
      <tr>
        <td style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            This is an automated message from Prisage Consulting Pvt. Ltd.
          </p>
          <p style="color: #6c757d; font-size: 12px; margin: 10px 0 0 0;">
            © ${new Date().getFullYear()} Prisage Consulting Pvt. Ltd. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const confirmationAgencyEmailTemplate = (token = ""): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Confirm Your Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px;">
      <tr>
        <td align="center">
          <h2 style="color: #333;">Welcome to the Prisage Consulting Pvt. Ltd.!</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 0; text-align: center;">
          <p style="font-size: 16px; color: #555;">
            To complete your registration, please confirm your email by clicking the button below:
          </p>
        </td>
      </tr>
      <tr>
        <td align="center">
          <a href="${process.env.FE_BASE_URL}/agency-signup/${token}" 
             style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Confirm Email
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 0; text-align: center;">
          <p style="font-size: 14px; color: #888;">
            Or copy and paste the following link into your browser:
          </p>
          <p style="font-size: 14px; color: #007BFF; word-break: break-all;">
            ${process.env.FE_BASE_URL}/agency-signup/${token}
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const vendorPlanUpgradeNotificationTemplate = (vendorDetails: {
  vendorName: string;
  currentPlan: string;
  requestedPlan: string;
  vendorEmail: string;
  vendorPhoneNumber: string;
  companyName: string;
}): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Vendor Plan Upgrade Request</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <h2 style="color: #2c3e50; margin: 0;">🔔 New Plan Upgrade Request</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Vendor Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Vendor Name:</strong></td>
              <td style="padding: 8px 0; color: #333;">${vendorDetails.vendorName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Company:</strong></td>
              <td style="padding: 8px 0; color: #333;">${vendorDetails.companyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Phone Number:</strong></td>
              <td style="padding: 8px 0; color: #333;">${vendorDetails.vendorPhoneNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Email:</strong></td>
              <td style="padding: 8px 0; color: #333;">${vendorDetails.vendorEmail}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; background-color: #e8f4f8; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Plan Change Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Current Plan:</strong></td>
              <td style="padding: 8px 0; color: #333;">${vendorDetails.currentPlan}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Requested Plan:</strong></td>
              <td style="padding: 8px 0; color: #28a745; font-weight: bold;">${vendorDetails.requestedPlan}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 0; text-align: center;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Please review this request and take appropriate action.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px 0; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            This is an automated notification from Prisage Consulting Pvt. Ltd.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
