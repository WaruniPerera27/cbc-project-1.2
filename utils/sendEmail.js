import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});


export async function sendWelcomeEmail(to) {
  await transporter.sendMail({
    from: `"Naturaglow🌿" <${process.env.EMAIL}>`,
    to,
    subject: "Welcome to Our Newsletter 🎉",
    html: `
      <h2>Thanks for subscribing!</h2>
      <p>You’ll now get updates and offers directly to your inbox 🌿</p>
    `
  });
}
