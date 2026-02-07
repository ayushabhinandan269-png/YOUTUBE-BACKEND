import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllVideos,
  getSingleVideo,
  uploadVideo,
  updateVideo,
  deleteVideo,
  addView,
  likeVideo,
  dislikeVideo,
} from "../controllers/videoController.js";

const router = express.Router();

router.get("/", getAllVideos);
router.get("/:videoId", getSingleVideo);

router.post("/", protect, uploadVideo);
router.put("/:videoId", protect, updateVideo);
router.delete("/:videoId", protect, deleteVideo);

router.post("/:videoId/view", addView);
router.post("/:videoId/like", protect, likeVideo);
router.post("/:videoId/dislike", protect, dislikeVideo);

export default router;

