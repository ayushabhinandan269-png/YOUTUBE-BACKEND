import express from "express";
import {
  createPlaylist,
  addVideoToPlaylist,
  getChannelPlaylists,
  getPlaylistById,
  deletePlaylist,
} from "../controllers/playlistController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPlaylist);
router.post("/:playlistId/videos", protect, addVideoToPlaylist);

router.get("/channel/:channelId", getChannelPlaylists);
router.get("/:id", getPlaylistById);

router.delete("/:id", protect, deletePlaylist);

export default router;
