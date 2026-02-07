import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createChannel,
  getAllChannels,
  getChannelById,
  getChannelVideos,
} from "../controllers/channelController.js";

const router = express.Router();

router.post("/", protect, createChannel);
router.get("/", getAllChannels);
router.get("/:id", getChannelById);
router.get("/:id/videos", getChannelVideos);

export default router;


