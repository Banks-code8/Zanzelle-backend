// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT || 465),
//   secure: process.env.SMTP_SECURE === "true",

//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // Test SMTP connection
// export const verifyMailer = async () => {
//   try {
//     await transporter.verify();
//     console.log("Mailer connected successfully");
//   } catch (error) {
//     console.error("Mailer connection failed:", error.message);
//     throw error;
//   }
// };

// export default transporter;
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

export const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log("✅ Mailer connected successfully");
  } catch (error) {
    console.error("❌ Mailer connection failed:", error);
    throw error;
  }
};

export default transporter;
