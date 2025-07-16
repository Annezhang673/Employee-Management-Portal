import User from "../models/user_model.js";
import RegistrationToken from "../models/registrationToken-model.js";
import House from "../models/house.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = "1d"; // Token valid for 1 day

export const registerUser = async (req, res) => {
  const { userName, email, password, token } = req.body;

  try {
    // Validate token
    const regToken = await RegistrationToken.findOne({ token });

    if (!regToken || regToken.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check for duplicate email or username
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ userName });
    if (emailExists || usernameExists) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const houses = await House.find();

    if (houses.length === 0) {
      return res
        .status(500)
        .json({ message: "No houses available for assignment" });
    }

    const assignedHouse = houses[Math.floor(Math.random() * houses.length)];

    // Create user
    const newUser = new User({
      userName: userName,
      email: email,
      password: hashedPassword,
      house: assignedHouse._id,
      role: "Employee",
    });

    await newUser.save();

    // Mark token as used (optional: or delete it)
    await RegistrationToken.deleteOne({ token });

    // Create JWT
    const payload = {
      id: newUser._id,
      role: newUser.role,
      email: newUser.email,
    };

    const authToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res
      .status(201)
      .json({
        authToken,
        message: "User registered successfully",
        success: true,
      });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
