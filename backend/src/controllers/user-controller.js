import User from "../models/user_model.js";

// Get api/users/me
export const getUserProfile = async (req, res) => {
  try {
    // getting the user id from mongoose User Schema
    const userId = req.user._id;
    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log("Unable to get user profile", error);
    res.status(500).json({ error: "Unable to get user profile", error });
  }
};

// Put api/users/me
export const updateUserProfile = async (req, res) => {
  try {
    // pull the required fields, might have more, will adjust as needed
    const { firstName, lastName, gender, address, phone, ssn, dob } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          firstName,
          lastName,
          gender,
          address,
          phone,
          ssn,
          dob,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedUser);
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
