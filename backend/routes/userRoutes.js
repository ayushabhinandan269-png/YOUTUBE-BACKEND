import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= LIKE / UNLIKE ================= */
router.post("/like/:videoId", protect, async (req, res) => {
  const { videoId } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const alreadyLiked = user.likedVideos.includes(videoId);

  if (alreadyLiked) {
    user.likedVideos = user.likedVideos.filter(id => id !== videoId);
  } else {
    user.likedVideos.push(videoId);
  }

  await user.save();

  res.json({
    liked: !alreadyLiked,
    likedVideos: user.likedVideos,
  });
});

/* ================= GET LIKED ================= */
router.get("/likes", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.likedVideos);
});

/* ================= SAVE HISTORY ================= */
router.post("/history/:videoId", protect, async (req, res) => {
  const { videoId } = req.params;
  const user = await User.findById(req.user.id);

  user.watchHistory.unshift({ videoId });
  user.watchHistory = user.watchHistory.slice(0, 100);

  await user.save();
  res.json({ message: "History saved" });
});

/* ================= GET HISTORY ================= */
router.get("/history", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.watchHistory);
});

export default router;
