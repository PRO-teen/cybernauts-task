import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import relationshipRoutes from "./routes/relationshipRoutes";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// User API routes
app.use("/api/users", userRoutes);
app.use("/api/users", relationshipRoutes);

export default app;
