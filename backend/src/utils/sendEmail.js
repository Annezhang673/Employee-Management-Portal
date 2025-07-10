import nodemailer from "nodemailer";

export const sendRegistrationEmail = async (email, tokenLink) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS?.length); // Should be 16

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"HR Portal" <no-reply@HRManagementPortal.com>`,
    to: email,
    subject: "Your Registration Link",
    html: `
        <p>Click below to register: </p>
        <a href="${tokenLink}">${tokenLink}</a>
        <p>This link will expire in 3 hours.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
