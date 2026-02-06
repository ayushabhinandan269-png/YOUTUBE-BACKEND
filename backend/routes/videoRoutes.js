import express from "express";
import Video from "../models/Video.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= GET ALL VIDEOS (FILTER) ================= */
router.get("/", async (req, res) => {
  const { category } = req.query;

  try {
    const videos =
      category && category !== "All"
        ? await Video.find({ category })
        : await Video.find();

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

/* ================= GET SINGLE VIDEO ================= */
router.get("/:videoId", async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch video" });
  }
});

/* ================= LIKE VIDEO ================= */
router.post("/:videoId/like", protect, async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.likes += 1;
    await video.save();

    res.json({ likes: video.likes });
  } catch (err) {
    res.status(500).json({ message: "Like failed" });
  }
});

/* ================= DISLIKE VIDEO ================= */
router.post("/:videoId/dislike", protect, async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.dislikes += 1;
    await video.save();

    res.json({ dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: "Dislike failed" });
  }
});

export default router;
