import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= LIKE / UNLIKE ================= */
router.post("/like/:videoId", protect, async (req, res) => {
  try {
    const { videoId } = req.params;
    const user = await User.findById(req.user);

    const index = user.likedVideos.findIndex(
      v => v.videoId === videoId
    );

    if (index > -1) {
      user.likedVideos.splice(index, 1);
      await user.save();
      return res.json({ liked: false });
    }

    user.likedVideos.push({ videoId });
    await user.save();

    res.json({ liked: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET LIKED ================= */
router.get("/likes", protect, async (req, res) => {
  const user = await User.findById(req.user).select("likedVideos");
  res.json(user.likedVideos);
});

/* ================= SAVE HISTORY ================= */
router.post("/history/:videoId", protect, async (req, res) => {
  try {
    const { videoId } = req.params;

    await User.findByIdAndUpdate(req.user, {
      $pull: { watchHistory: { videoId } },
    });

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
    res.status(500).json({ message: err.message });
  }
});

/* ================= GET HISTORY ================= */
router.get("/history", protect, async (req, res) => {
  const user = await User.findById(req.user).select("watchHistory");
  res.json(user.watchHistory);
});

/* ================= SUBSCRIBE ================= */
router.post("/subscribe/:channel", protect, async (req, res) => {
  const { channel } = req.params;

  await User.findByIdAndUpdate(req.user, {
    $addToSet: { subscriptions: { channelName: channel } },
  });

  res.json({ message: "Subscribed" });
});

/* ================= GET SUBSCRIPTIONS ================= */
router.get("/subscriptions", protect, async (req, res) => {
  const user = await User.findById(req.user).select("subscriptions");
  res.json(user.subscriptions);
});

export default router;

