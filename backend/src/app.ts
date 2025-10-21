import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import relationshipRoutes from "./routes/relationshipRoutes";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: ["https://cybernauts-task.vercel.app"],
    credentials: true,
  })
);


app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/users", relationshipRoutes);

export default app;
