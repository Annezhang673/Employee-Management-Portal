import User from "../models/user_model.js";
import Application from "../models/application_model.js";

// Get api/users/me
export const getUserProfile = async (req, res) => {
  try {
    // getting the user id from mongoose User Schema
    const userId = req?.user?._id || req.query.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const applicationId = user.application;
    // populate the applications field
    const application = await Application.find({ _id: applicationId });
    user.application = application;

    res.status(200).json({ user, application });
  } catch (error) {
    console.log("Unable to get user profile", error);
    res.status(500).json({ error: "Unable to get user profile", error });
  }
};

// Put api/users/me
export const updateUserProfile = async (req, res) => {
  try {
    // pull the required fields, might have more, will adjust as needed
    //  req.body will contails partial application data, which user contains application id

    const userId = req?.user?._id || req.query.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const application = await Application.findById(user.application);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: req.body },
      { new: true }
    );

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
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Unable to get user by id", error);
    res.status(500).json({ error: "Unable to get user by id", error });
  }
};
