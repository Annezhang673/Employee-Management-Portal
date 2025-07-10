import { uploadFileToS3 } from "../lib/s3.js";

// Post /api/documents/upload
// expect a single file, folder = "documents", userId in req.user
export const uploadDocuments = async (req, res) => {
  try {
    const userId = req.user?._id || "anonymous";

    // might try not accepting anonymous users later

    const documentType = req.body.documentType; // like driver_license
    if (!documentType) {
      return res.status(400).json({ error: "Document type is required" });
    }

    const result = await uploadFileToS3(req.file, `documents/${documentType}`, userId);

    // might need to modified user schema by adding a documents array
    // const user = await User.findById(req.user._id);
    // user.documents.push({
    //   name: documentType,
    //   fileUrl: result.url,
    //   uploadedAt: new Date(),
    // })

    // await user.save();

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
