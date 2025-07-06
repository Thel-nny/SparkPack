import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "false", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "sparkpack.2025@gmail.com",
    pass: process.env.SMTP_PASS || "lcvphpvmgtsrenjf",
  },
});

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"No Reply" <no-reply@example.com>',
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    // Fallback: Log the email content for development/testing
    console.log("Fallback email content:", mailOptions);
    // Optionally, do not throw error to avoid blocking the main flow
  }
}
