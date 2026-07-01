import { Router } from 'express';
import nodemailer from 'nodemailer';
import env from '../config/env.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.'
      });
    }

    const recipient = env.FEEDBACK_RECIPIENT;

    // SMTP configuration
    const { host, port, user, pass } = env.SMTP;

    if (user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass
        }
      });

      await transporter.sendMail({
        from: `"${name} (via CareerPilot360)" <${user}>`,
        to: recipient,
        replyTo: email,
        subject: `New Feedback from ${name} on CareerPilot360`,
        text: `Name: ${name}\nEmail: ${email}\n\nFeedback:\n${message}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">New Feedback Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 15px; border: 1px solid #eee;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `
      });

      console.log(`✅ Feedback email successfully sent to ${recipient}`);
    } else {
      console.warn('⚠️ SMTP credentials (SMTP_USER/SMTP_PASS) not configured in .env. Feedback logged to console:\n', {
        to: recipient,
        from: email,
        name,
        message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback received successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
