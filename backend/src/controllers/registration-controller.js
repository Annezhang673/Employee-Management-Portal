import crypto from "crypto";
import { sendRegistrationEmail } from "../utils/sendEmail.js";
import RegistrationToken from "../models/registrationToken-model.js";

export const generateAndSendToken = async (req, res) => {
  try {
    const { email } = req.body;

    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hrs

    const newToken = new RegistrationToken({ email, token, expiresAt });
    await newToken.save();

    const tokenLink = `http://localhost:3000/registration/${token}`;
    await sendRegistrationEmail(email, tokenLink);

    res.status(200).json({ message: "Registration token sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Only verify token status, don't mutate any data
export const checkToken = async (req, res) => {
  const { token } = req.params;

  const tokenDoc = await RegistrationToken.findOne({ token });
  
  if (!tokenDoc || tokenDoc.used || tokenDoc.expiresAt < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
  return res.status(200).json({ email: tokenDoc.email, valid: true });
}

// validate token
export const validateToken = async (req, res) => {
  try {
    const token = req.params.token;

    const tokenDoc = await RegistrationToken.findOne({ token });

    if (!tokenDoc || tokenDoc.used || tokenDoc.expiresAt < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    tokenDoc.used = true;
    await tokenDoc.save();

    res.status(200).json({ email: tokenDoc.email, valid: true });
  } catch (error) {
    res.status(500).json({ error: "Token validation failed" });
  }
};

// view token usage history
export const viewTokenStatus = async (req, res) => {
  try {
    // const tokens = await RegistrationToken.find({});

    // res.status(200).json({ tokens });

    const docs = await RegistrationToken.find({}).lean();
    const tokens = docs.map(t => ({
      email:     t.email,
      link:      `http://localhost:3000/registration/${t.token}`,
      status:    t.used ? 'Used'
                : t.expiresAt < Date.now() ? 'Expired'
                : 'Unused',
      createdAt: t.createdAt.toISOString()
    }));
    res.json({ tokens });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
