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
      "http://localhost:5173",
      "https://cybernauts-task.vercel.app",
      "https://cybernauts-task-git-main-ayush-yadavs-projects-ae02f4a6.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// User API routes
app.use("/api/users", userRoutes);
app.use("/api/users", relationshipRoutes);

export default app;
