import mongoose from "mongoose";

const visaDocSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["OPT Receipt", "EAD", "I-983", "New I-20"],
    required: true,
  },
  s3Key: { type: String, required: true },
  // url:        { type: String, required: true },
  url: {
    previewUrl: { type: String },
    downloadUrl: { type: String },
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  feedback: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

export default visaDocSchema;
