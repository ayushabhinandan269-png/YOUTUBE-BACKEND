import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 
app.use("/api/comments", commentRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Protected route working" });
});

app.get("/", (req, res) => {
  res.status(200).send("YouTube Clone API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
