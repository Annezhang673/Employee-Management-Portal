import mongoose from "mongoose";

const registerationTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});
 
const RegistrationToken = mongoose.model(
  "RegistrationToken",
  registerationTokenSchema
);

export default RegistrationToken;