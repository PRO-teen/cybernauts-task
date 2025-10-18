import dotenv from "dotenv";
import app from "./app";              // ✅ same folder
import connectDB from "./config/db";  // ✅ one level inside config

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
