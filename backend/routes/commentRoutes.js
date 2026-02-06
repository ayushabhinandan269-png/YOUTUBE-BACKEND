import express from "express";
import Comment from "../models/Comment.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADD COMMENT ================= */
router.post("/:videoId", protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await Comment.create({
      videoId: req.params.videoId,
      userId: req.user,        // user id from JWT
      username: req.body.username || "Anonymous",
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

/* ================= GET COMMENTS FOR A VIDEO ================= */
router.get("/:videoId", async (req, res) => {
  try {
    const comments = await Comment.find({
      videoId: req.params.videoId,
    }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

/* ================= DELETE COMMENT (OWNER ONLY) ================= */
router.delete("/:commentId", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

export default router;
