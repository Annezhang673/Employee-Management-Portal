import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export const verifyToken = async (req, res, next) => {
  // const token = req.headers["authorization"]?.split(" ")[1];

  const header = req.headers.authorization || req.headers.Authorization;
  // console.log("→ incoming auth header:", header);

  const token = header?.split(" ")[1];

  if (!token) {
    // console.log("🔴 no token at all");

    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("→ decoded JWT payload:", decoded);

    const id = decoded.userId || decoded.sub;
    // console.log("→ using user-id for lookup:", id);

    if (!id) {
      return res.status(401).json({ message: "Invalid token payload." });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      console.log("🔴 user lookup failed for id", id);
      return res.status(401).json({ message: "User not found." });
    }

    // console.log("✅ token OK, attached user:", user.userName);
    req.user = user;
    next();
  } catch (error) {
    console.log("🔴 jwt.verify error:", error.message);
    return res.status(401).json({ message: "Invalid token." });
  }
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};
