import crypto from "crypto";
import { sendRegistrationEmail } from "../utils/sendEmail.js";


export const generateAndSendToken = async (req, res) => {
  try {
    const { email } = req.body;

    const token = crypto.randomBytes(16).toString("hex");
    // const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hrs

    // const newToken = new RegistrationToken({ email, token, expiresAt });
    // await newToken.save();

    const tokenLink = `http://localhost:3000/registration/${token}`;
    await sendRegistrationEmail(email, tokenLink);

    res.status(200).json({ message: "Registration token sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getToken = async (req, res) => {
  try {
    const token = req.params.token;

    const tokenDoc = await RegistrationToken.findOne({ token });

    if (!tokenDoc || tokenDoc.used || tokenDoc.expiresAt < Date.now()) {
      res.status(400).json({ error: "Invalid or expired token" });
    }

    res.status(200).json({ email: tokenDoc.email, valid: true });
  } catch (error) {
    res.status(500).json({ error: "Token validation failed" });
  }
};
