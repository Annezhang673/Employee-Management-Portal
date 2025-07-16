import Application from "../models/application_model.js";
import User from "../models/user_model.js";
import { getSignedFileURL, uploadFileToS3 } from "../lib/s3.js";

// api/onboarding
export const submitOnboardingApplication = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const rawData = req.body.data;

    if (!rawData) {
      return res.status(400).json({ error: "Data is required" });
    }

    let parseData;

    try {
      parseData = JSON.parse(rawData);
    } catch (error) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const existingApplication = await Application.findOne({ user: userId });

    const uploadedDocs = await Promise.all(
      (req.files || []).map(async (file) => {
        const s3Upload = await uploadFileToS3(file, "documents", userId);
        return {
          name: file.fieldname, // profilePic, etc.
          s3Key: s3Upload.key,
        };
      })
    );

    let mergedDocuments = uploadedDocs;
    if (existingApplication?.documents?.length) {
      const existingDocsMap = new Map();

      existingApplication.documents.forEach((doc) => {
        existingDocsMap.set(doc.name, doc);
      });

      uploadedDocs.forEach((doc) => {
        existingDocsMap.set(doc.name, doc);
      });

      // Reconstruct the documents array
      mergedDocuments = Array.from(existingDocsMap.values());
    }

    const updatedApp = await Application.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        data: parseData,
        documents: mergedDocuments,
        status:
          existingApplication?.status === "Rejected"
            ? "Pending"
            : existingApplication?.status || "Pending",
      },
      { upsert: true, new: true }
    );

    const visaDocFields = ["optReceipt", "ead", "i983", "newI20"];
    const visaDocTypeMap = {
      optReceipt: "OPT Receipt",
      ead: "EAD",
      i983: "I-983",
      newI20: "New I-20",
    };

    const visaDocs = await Promise.all(
      mergedDocuments
        .filter((doc) => visaDocFields.includes(doc.name))
        .map(async (doc) => {
          const signedUrl = await getSignedFileURL(doc.s3Key);
          return {
            type: visaDocTypeMap[doc.name], // e.g., "OPT Receipt"
            s3Key: doc.s3Key,
            url: signedUrl,
            uploadedAt: new Date(),
            status: "Pending",
          };
        })
    );

    const userUpdate = {
      application: updatedApp._id,
    };

    const profileDoc = mergedDocuments.find((doc) => doc.name === "profilePic");
    if (profileDoc) {
      const { previewUrl } = await getSignedFileURL(profileDoc.s3Key);
      userUpdate.profilePicUrl = previewUrl;
    }

    if (parseData.visa?.type) {
      userUpdate.visaType = parseData.visa.type;
    }

    await User.findByIdAndUpdate(userId, {
      ...userUpdate,
      visaDocs: visaDocs,
    });

    const updatedUser = await User.findById(userId);

    const signedDocuments = await Promise.all(
      updatedApp.documents.map(async (doc) => {
        const signedUrl = await getSignedFileURL(doc.s3Key);
        return {
          ...doc.toObject(),
          url: signedUrl,
        };
      })
    );

    res.status(201).json({
      ...updatedApp._doc,
      documents: signedDocuments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// get current latest onboarding application for user
export const viewOnboardingApplication = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;
    
    const application = await Application.find({ user: userId });

    // if mutiple application submit by same user, getting the lastest one
    if (application.length > 1) {
      application.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
    }

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const signedDocuments = await Promise.all(
      application[0].documents.map(async (doc) => {
        const { previewUrl, downloadUrl } = await getSignedFileURL(doc.s3Key);
        return {
          ...doc.toObject(),
          previewUrl,
          downloadUrl,
        };
      })
    );

    res.status(200).json({
      ...application[0]._doc,
      documents: signedDocuments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// update the onboarding application if needed, or reject by HR
export const updateOnboardingApplication = async (req, res) => {
  try {
    const userId = req.user?._id;

    const application = await Application.findOne({ user: userId });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (req.body.data) {
      application.data =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body.data;
    }

    if (req.files.length > 0) {
      const documents = await Promise.all(
        req.files.map(async (file) => {
          const { key } = await uploadFileToS3(file, "documents", userId);

          return {
            name: file.fieldname, // profilePic, etc.
            s3Key: key,
          };
        })
      );

      const docMap = new Map();
      application.documents.forEach((doc) => {
        docMap.set(doc.name, doc);
      });
      documents.forEach((doc) => {
        docMap.set(doc.name, doc);
      });

      application.documents = Array.from(docMap.values());
    }

    await application.save();

    const signedDocuments = await Promise.all(
      application.documents.map(async (doc) => {
        const signedUrl = await getSignedFileURL(doc.s3Key);
        return {
          ...doc.toObject(),
          url: signedUrl,
        };
      })
    );

    res.status(200).json({
      ...application._doc,
      documents: signedDocuments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
