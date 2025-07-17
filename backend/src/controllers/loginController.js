import User from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Application from "../models/application_model.js";

export const userLogin = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const application = await Application.findOne({ _id: user.application });

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(user.userName);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username/password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Login successful",
      token: token,
      role: user.role,
      userName: user.userName,
      applicationStatus: application?.status || null,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
