import express from "express";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";

import {
  createChannel,
  getAllChannels,
  getChannelById,
  getChannelVideos,
  updateChannel, // ✅ MISSING IMPORT (FIXED)
} from "../controllers/channelController.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const upload = multer({ dest: "uploads/" });

/* ================= CREATE CHANNEL ================= */
router.post("/", protect, createChannel);

/* ================= UPDATE CHANNEL (AVATAR + BANNER) ================= */
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateChannel
);

/* ================= GET ALL CHANNELS ================= */
router.get("/", getAllChannels);

/* ================= GET SINGLE CHANNEL ================= */
router.get("/:id", getChannelById);

/* ================= GET CHANNEL VIDEOS ================= */
router.get("/:id/videos", getChannelVideos);

export default router;



