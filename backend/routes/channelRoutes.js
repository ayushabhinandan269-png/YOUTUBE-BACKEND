import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createChannel,
  getChannelById,
  getChannelVideos,
  getAllChannels,
} from "../controllers/channelController.js";

const router = express.Router();

/* CREATE CHANNEL */
router.post("/", protect, createChannel);

/* LIST CHANNELS (SIDEBAR) */
router.get("/", getAllChannels);

/* SINGLE CHANNEL */
router.get("/:id", getChannelById);

/* CHANNEL VIDEOS */
router.get("/:id/videos", getChannelVideos);

export default router;

