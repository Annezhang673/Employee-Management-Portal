import Application from "../models/application_model.js";
import { uploadFileToS3 } from "../lib/s3.js";

// api/onboarding
export const submitOnboardingApplication = async (req, res) => {
  try {
    // mock userId for now
    const mockId = "6871ea0ed0419f9413b9f685";
    const userId = req?.user?._id || mockId;

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

    const documents = await Promise.all(
      req.files.map(async (file) => {
        const s3Upload = await uploadFileToS3(file, "documents", userId);

        return {
          name: file.fieldname, // profilePic, etc.
          s3Key: s3Upload.key,
          url: s3Upload.url,
        };
      })
    );

    const application = await Application.create({
      user: userId,
      data: parseData,
      documents,
    });

    res.status(201).json(application);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// get current latest onboarding application for user
export const viewOnboardingApplication = async (req, res) => {
  try {
    const userId = req?.user?._id || "6871ea0ed0419f9413b9f685";

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

    res.status(200).json(application[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// update the onboarding application if needed, or reject by HR
export const updateOnboardingApplication = async (req, res) => {
  try {
    const userId = req?.user?._id || "6871ea0ed0419f9413b9f685";

    const application = await Application.findOne({ user: userId });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (req.body.data) {
      application.data = req.body.data;
    }

    if (req.files.length > 0) {
      const documents = await Promise.all(
        req.files.map(async (file) => {
          const s3Upload = await uploadFileToS3(file, "documents", userId);

          return {
            name: file.fieldname, // profilePic, etc.
            s3Key: s3Upload.key,
            url: s3Upload.url,
          };
        })
      );

      application.documents.push(...documents);
    }

    await application.save();

    res.status(200).json(application);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
