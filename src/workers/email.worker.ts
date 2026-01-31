import { env } from '@/configs/env.config.js';
import nodemailer, { type Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

class EmailWorker {
  private transporter: Transporter;
  private senderEmail: string;

  constructor() {
    this.senderEmail = env.mail.user;

    const smtpConfig: SMTPTransport.Options = {
      host: env.mail.host,
      port: env.mail.port,
      secure: env.mail.port === 465,
      auth: {
        user: env.mail.user,
        pass: env.mail.password,
      },
    };
    this.transporter = nodemailer.createTransport(smtpConfig);
  }

  sendMail(targetEmail: string, content: string) {
    if (!this.transporter) {
      throw new Error('Email Transporter not initialized.');
    }

    return this.transporter.sendMail({
      from: this.senderEmail,
      to: targetEmail,
      subject: 'Export Playlist Song',
      text: 'Export Playlist Song',
      attachments: [
        {
          filename: 'playlist-song.json',
          content,
        },
      ],
    });
  }
}

export const emailWorker = new EmailWorker();
