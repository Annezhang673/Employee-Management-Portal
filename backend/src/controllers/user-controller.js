import User from "../models/user_model.js";
import Application from "../models/application_model.js";
import { uploadFileToS3, getSignedFileURL } from "../lib/s3.js";

// Get api/users/me
export const getUserProfile = async (req, res) => {
  try {
    // getting the user id from mongoose User Schema
    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const applicationId = user.application;
    // populate the applications field
    const application = await Application.find({ _id: applicationId });
    user.application = application;

    let signedProfilePicUrl = null;
    if (user.profilePicUrl) {
      const {previewUrl} = await getSignedFileURL(user.profilePicUrl);
      signedProfilePicUrl = previewUrl
    }

    res.status(200).json({ user, application, signedProfilePicUrl });
  } catch (error) {
    console.log("Unable to get user profile", error);
    res.status(500).json({ error: "Unable to get user profile", error });
  }
};

// Put api/users/me
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId; // userId from middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const application = await Application.findById(user.application);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const formData = JSON.parse(req.body.data || "{}");

    if (req.file) {
      const { key } = await uploadFileToS3(req.file, "documents", userId);
      formData.profilePic = key;
      user.profilePicUrl = key;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: formData },
      { new: true }
    );

    await user.save();

    application.data = {
      ...application.data,
      ...req.body,
    };

    const updatedApplication = await application.save();

    res
      .status(200)
      .json({ user: updatedUser, application: updatedApplication });
  } catch (error) {
    console.log("Unable to update user profile", error);
    res.status(500).json({ error: "Unable to update user profile", error });
  }
};

// Get api/users/:userId
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Unable to get user by id", error);
    res.status(500).json({ error: "Unable to get user by id", error });
  }
};

export const listEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'Employee' })
      .select('firstName lastName preferredName ssn workAuthTitle phone email')
      .sort({ lastName: 1 })
      .lean();
    res.status(200).json(employees);
  } catch (err) {
    console.error('Error listing employees:', err);
    res.status(500).json({ error: 'Could not list employees.' });
  }
};