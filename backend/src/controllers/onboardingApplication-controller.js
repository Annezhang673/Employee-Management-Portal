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
