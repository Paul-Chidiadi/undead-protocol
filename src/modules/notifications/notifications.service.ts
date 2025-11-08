import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailConfig } from 'src/common/config/env.config';
import { convertEmailToText } from 'src/common/utils/utils.service';

export interface Mail {
  email: string;
  firstName?: string;
  OTP?: number | string;
  subject: string;
}

@Injectable()
export class NotificationsService {
  private emailFrom = emailConfig.EMAIL_FROM;
  private baseUrl = emailConfig.BASE_URL;
  private MAIL_HOST = emailConfig.MAIL_HOST;
  private MAIL_USERNAME = emailConfig.MAIL_USERNAME;
  private MAIL_PASSWORD = emailConfig.MAIL_PASSWORD;
  private MAIL_PORT = emailConfig.MAIL_PORT;

  constructor() {}

  async sendMail(options: Mail, template: string): Promise<any> {
    const text = convertEmailToText(template);
    const msg: any = {
      to: options.email,
      from: this.emailFrom, // Use the email address or domain you verified above
      subject: options.subject,
      text,
      html: template,
    };

    try {
      if (process.env.NODE_ENV === 'production') {
        const transporter = nodemailer.createTransport({
          host: this.MAIL_HOST,
          port: Number(this.MAIL_PORT),
          auth: {
            user: this.MAIL_USERNAME,
            pass: this.MAIL_PASSWORD,
          },
        });
        // send the email with nodemailer
        try {
          const result = await transporter.sendMail(msg);
          return result;
        } catch (error: any) {
          console.log(error);
          if (error.response) {
            console.error(error.response.body);
          }
        }
      }
      const transporter = nodemailer.createTransport({
        host: this.MAIL_HOST,
        port: Number(this.MAIL_PORT),
        secure: true,
        auth: {
          user: this.MAIL_USERNAME,
          pass: this.MAIL_PASSWORD,
        },
      });
      // send the email with nodemailer
      const result = await transporter.sendMail(msg);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async sendOTP(options: Mail) {
    if (options.OTP !== undefined && options.OTP.toString().length === 6) {
      const message = `<p>Hello ${options.firstName},</p>
      <p>Welcome to Rust Undead. Please verify your 
      email address with the OTP code below. It would expire after 10mins.<p>
      <p>OTP: <b>${options.OTP}</b></p>
      <p>Team Rust Undead</p>`;
      return await this.sendMail(options, message);
    }
  }
}
