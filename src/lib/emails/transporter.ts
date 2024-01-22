import { env } from '@/validations/env';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport(
  {
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: process.env.NODE_ENV === 'production',
    auth: {
      user: env.ADMIN_EMAIL,
      pass: env.BREVO_SMTP_KEY,
    },
  },
  { debug: process.env.NODE_ENV === 'development' }
);
