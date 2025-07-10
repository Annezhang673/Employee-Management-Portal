import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import registrationTokenRoutes from "./src/routes/registrationToken-route.js";
import housingRoutes from "./src/routes/housing-route.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/tokens", registrationTokenRoutes);
app.use("/api/housing", housingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
