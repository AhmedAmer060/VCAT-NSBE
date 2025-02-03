import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const boardEmails = [
  "matthan.mbanefe@vaughn.edu",
  "ean.chambers@vaughn.edu",
  "alair.cunningham@vaughn.edu",
  "shaden.youssef@vaughn.edu",
  "zaheer.hanif@vaughn.edu",
  "yaako.cunningham@vaughn.edu",
  "ahmed.amer@vaughn.edu"
];

export async function sendNotificationEmail(subject: string, content: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: boardEmails.join(", "),
      subject: `VCAT NSBE Portal - ${subject}`,
      html: content,
    });
    console.log(`Notification email sent: ${subject}`);
  } catch (error) {
    console.error("Failed to send notification email:", error);
  }
}
