import express from "express";
import studentRouter from "./src/routes/student.route.js";
import authRouter from "./src/routes/auth.route.js";
import Logger from "./src/middleware/logger.js";
import { verifyToken } from "./src/middleware/auth.js";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import cors from "cors";

dotenv.config({ path: "./.env" });

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
  }),
);

app.use(express.json());
app.use(Logger);
app.use("/auth", authRouter);
app.use(verifyToken);
app.use("/students", studentRouter);

// connectDB();
// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

const startServer = async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
};

startServer();
