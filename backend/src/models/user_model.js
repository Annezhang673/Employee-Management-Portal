import mongoose from "mongoose";
import visaDocSchema from "./subschemas/visaDoc.js";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    preferredName: { type: String, default: null },
    phone: { type: String, default: null },
    ssn: { type: String, default: null },
    workAuthTitle: { type: String, default: null },
    role: { type: String, enum: ["Employee", "HR"], default: "Employee" },
    profilePicUrl: { type: String }, // user upload profile picture to AWS S3, and we store that link
    visaType: {
      type: String,
      enum: ["None", "OPT", "H1B", "F1", "J1", "J2", "J3", "Other"],
      default: "None",
    },
    visaDocs: [visaDocSchema],
    house: { type: mongoose.Schema.Types.ObjectId, ref: "House" },
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application" }, // refer to Application schema, and determine if we should redirect user to home page
  },
  {
    timestamps: true,
    /*
      by using timestamps: true 
      Mongoose automatically adds two fields to each document:
         createdAt: Date
         updatedAt: Date
   */
  }
);

const User = mongoose.model("User", userSchema);
export default User;
