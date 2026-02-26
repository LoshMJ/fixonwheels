import nodemailer from "nodemailer";

export function createMailer() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendOrderCompletedEmail(to: string, orderId: string) {
  const transporter = createMailer();
  if (!transporter) {
    console.log("📧 SMTP not configured. Skipping email.");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  await transporter.sendMail({
    from,
    to,
    subject: "Your FixOnWheels order is completed ✅",
    text: `Your order ${orderId} has been completed. Thank you for shopping with FixOnWheels!`,
  });
}