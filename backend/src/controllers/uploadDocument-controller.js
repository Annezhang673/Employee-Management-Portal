import { uploadFileToS3, getSignedFileURL } from "../lib/s3.js";
import User from "../models/user_model.js";

// Post /api/documents/upload
// expect a single file, folder = "documents", userId in req.user
export const uploadDocuments = async (req, res) => {
  try {
    const validVisaDocTypes = ["OPT Receipt", "EAD", "I-983", "New I-20"];
    const userId = req.user?.id;
    const docName = req.body.name;

    console.log(
      "Received file upload for user",
      userId,
      "with doc name",
      docName
    );
    if (!validVisaDocTypes.includes(docName)) {
      return res.status(400).json({ error: "Invalid document name" });
    }

    const { key } = await uploadFileToS3(
      req.file,
      `documents/${userId}/visa/${docName}`,
      userId
    );

    const { previewUrl, downloadUrl } = await getSignedFileURL(key);

    const docObject = {
      type: docName,
      s3Key: key,
      previewUrl,
      downloadUrl,
      status: "Pending",
      uploadedAt: new Date(),
    };

    const updatedResult = await User.findOneAndUpdate(
      { _id: userId, "visaDocs.type": docName },
      { $set: { "visaDocs.$": docObject } },
      { new: true }
    );

    if (!updatedResult) {
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { visaDocs: docObject } }
      );
    }

    res.status(200).json({ message: "File uploaded successfully", docObject });
  } catch (error) {
    console.log("Upload error", error);
    res.status(500).json({ error: "File upload failed" });
  }
};

// getting user documents
export const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const signedVisaDocs = await Promise.all(
      (user.visaDocs || []).map(async (doc) => {
        const { previewUrl, downloadUrl } = await getSignedFileURL(doc.s3Key);
        return {
          ...doc.toObject(),
          previewUrl,
          downloadUrl,
        };
      })
    );

    res
      .status(200)
      .json({ profilePicUrl: user.profilePicUrl, visaDocs: signedVisaDocs });
  } catch (error) {
    console.log("Unable to get user documents", error);
    res.status(500).json({ error: "Unable to get user documents", error });
  }
};
