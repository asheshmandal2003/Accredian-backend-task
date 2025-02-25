import nodemailer from "nodemailer";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const emailPort = process.env.EMAIL_PORT;
const emailHost = process.env.EMAIL_HOST;
const emailPass = process.env.EMAIL_PASS;
const emailUser = process.env.EMAIL_USER;
const emailSecure = process.env.EMAIL_SECURE;
const emailService = process.env.EMAIL_SERVICE;

export const sendMail = async (email, referrerEmail) => {
  try {
    if (
      !emailPort ||
      !emailHost ||
      !emailPass ||
      !emailUser ||
      !emailSecure ||
      !emailService
    ) {
      throw new Error("Environment variables for email are missing!");
    }

    const transporter = nodemailer.createTransport({
      host: emailHost,
      service: emailService,
      port: Number(emailPort),
      secure: Boolean(emailSecure),
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailData = {
      from: emailUser,
      to: email,
      subject: "You have been referred!",
      html: `
          <html>
            <body>
              <div style="font-family: Arial, sans-serif; text-align: center;">
                <h2>You’ve Been Referred!</h2>
                <p><strong>${referrerEmail}</strong> has referred you to join our platform!</p>
                <p>Click the button below to sign up and get started:</p>
                <a href="http://localhost:3000" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Now</a>
                <p>If you didn’t request this, you can safely ignore this email.</p>
              </div>
            </body>
          </html>
        `,
    };

    const response = await transporter.sendMail(mailData);
    return response;
  } catch (error) {
    console.log(error.message);
    if (error.response && error.response.includes("550")) {
      throw new Error("Invalid email address");
    }
    throw new Error("Failed to send email");
  }
};
