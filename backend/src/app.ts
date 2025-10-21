import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import relationshipRoutes from "./routes/relationshipRoutes";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local dev
      "https://cybernauts-task.vercel.app", // your Vercel frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// User API routes
app.use("/api/users", userRoutes);
app.use("/api/users", relationshipRoutes);

export default app;
