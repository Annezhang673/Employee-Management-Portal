import { uploadFileToS3 } from "../lib/s3.js";
import Application from "../models/application_model.js";

// Post /api/documents/upload
// expect a single file, folder = "documents", userId in req.user
export const uploadDocuments = async (req, res) => {
  try {
    const userId = req.user?.id;

    // might try not accepting anonymous users later

    const documentType = req.body.documentType; // like driver_license
    if (!documentType) {
      return res.status(400).json({ error: "Document type is required" });
    }

    const result = await uploadFileToS3(
      req.file,
      `documents/${documentType}`,
      userId
    );

    const application = await Application.findOne({ userId });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.documents.push({
      name: req.file.originalname,
      s3Key: result.key,
      url: result.url,
    });
    await application.save();

    res.status(200).json({
      message: "File uploaded successfully",
      key: result.key,
      url: result.url,
    });
  } catch (error) {
    console.log("Upload error", error);
    res.status(500).json({ error: "File upload failed" });
  }
};
