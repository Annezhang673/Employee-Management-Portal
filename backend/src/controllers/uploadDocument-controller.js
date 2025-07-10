import { uploadFileToS3 } from "../lib/s3.js";

// Post /api/documents/upload
// expect a single file, folder = "documents", userId in req.user
export const uploadDocuments = async (req, res) => {
  try {
    const userId = req.user?._id || "anonymous";
    const result = await uploadFileToS3(req.file, "documents", userId);

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
