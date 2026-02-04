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
  try {
    const { videoId } = req.params;

    await User.findByIdAndUpdate(
      req.user, // because in middleware: req.user = decoded.id
      {
        $pull: { watchHistory: { videoId } }, // remove if already exists
      }
    );

    await User.findByIdAndUpdate(
      req.user,
      {
        $push: {
          watchHistory: {
            $each: [{ videoId }],
            $position: 0,   // add to top
            $slice: 100     // keep only last 100
          }
        }
      }
    );

    res.json({ message: "History saved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= GET HISTORY ================= */
router.get("/history", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("watchHistory");
    res.json(user.watchHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
