import nodemailer from "nodemailer";
import { EmailPayload } from "../../types";
import Mail from "nodemailer/lib/mailer";

export const sendEmail = async (options: EmailPayload) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST as string,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.NODE_ENV !== "production",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      logger: true,
      debug: true,
    } as nodemailer.TransportOptions);

    const mailOpts: Mail.Options = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOpts);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("SMTP connection error: " + (error as Error).message);
  }
};
