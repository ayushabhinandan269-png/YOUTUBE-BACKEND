import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= LIKE / UNLIKE VIDEO ================= */
router.post("/like/:videoId", protect, async (req, res) => {
  try {
    const { videoId } = req.params;

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.likedVideos.findIndex(
      v => v.videoId === videoId
    );

    if (index > -1) {
      // UNLIKE
      user.likedVideos.splice(index, 1);
      await user.save();
      return res.json({ liked: false });
    }

    // LIKE
    user.likedVideos.push({ videoId });
    await user.save();

    res.json({ liked: true });
  } catch (err) {
    console.error("LIKE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET LIKED VIDEOS ================= */
router.get("/likes", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("likedVideos");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.likedVideos);
  } catch (err) {
    console.error("GET LIKES ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= SAVE WATCH HISTORY ================= */
router.post("/history/:videoId", protect, async (req, res) => {
  try {
    const { videoId } = req.params;

    // Remove old entry if exists
    await User.findByIdAndUpdate(req.user, {
      $pull: { watchHistory: { videoId } },
    });

    // Add to top, keep max 100
    await User.findByIdAndUpdate(req.user, {
      $push: {
        watchHistory: {
          $each: [{ videoId }],
          $position: 0,
          $slice: 100,
        },
      },
    });

    res.json({ message: "History saved" });
  } catch (err) {
    console.error("HISTORY ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET WATCH HISTORY ================= */
router.get("/history", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("watchHistory");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.watchHistory);
  } catch (err) {
    console.error("GET HISTORY ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= SUBSCRIBE TO CHANNEL ================= */
router.post("/subscribe/:channel", protect, async (req, res) => {
  try {
    const { channel } = req.params;

    await User.findByIdAndUpdate(req.user, {
      $addToSet: { subscriptions: { channelName: channel } },
    });

    res.json({ message: "Subscribed" });
  } catch (err) {
    console.error("SUBSCRIBE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET SUBSCRIPTIONS ================= */
router.get("/subscriptions", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("subscriptions");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.subscriptions);
  } catch (err) {
    console.error("GET SUBSCRIPTIONS ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

