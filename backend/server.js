import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./src/lib/db.js";
import registrationTokenRoutes from "./src/routes/registrationToken-route.js";
import housingRoutes from "./src/routes/housing-route.js";
import uploadDocumentRoutes from "./src/routes/documentUpload-route.js";
import HrReviewRoute from './src/routes/HrReview-route.js';


const app = express();
dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/tokens", registrationTokenRoutes);
app.use("/api/housing", housingRoutes);
app.use("/api/documents", uploadDocumentRoutes);
app.use("/api/hiring/review",     HrReviewRoute);           


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectDB();
});
