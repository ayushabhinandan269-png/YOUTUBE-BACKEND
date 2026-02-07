import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

/* ================= GET ALL VIDEOS ================= */
export const getAllVideos = async (req, res) => {
  try {
    const { category } = req.query;

    const videos =
      category && category !== "All"
        ? await Video.find({ category }).sort({ createdAt: -1 })
        : await Video.find().sort({ createdAt: -1 });

    res.json(videos);
  } catch (err) {
    console.error("getAllVideos error:", err);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};

/* ================= GET SINGLE VIDEO ================= */
export const getSingleVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);
  } catch (err) {
    console.error("getSingleVideo error:", err);
    res.status(500).json({ message: "Failed to fetch video" });
  }
};

/* ================= UPLOAD VIDEO ================= */
export const uploadVideo = async (req, res) => {
  try {
    const {
      videoId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
    } = req.body;

    if (!videoId || !title || !videoUrl || !thumbnailUrl || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const channel = await Channel.findOne({ owner: req.user });
    if (!channel) {
      return res.status(403).json({ message: "Create a channel first" });
    }

    const exists = await Video.findOne({ videoId });
    if (exists) {
      return res.status(400).json({ message: "Video already exists" });
    }

    const video = await Video.create({
      videoId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channel: channel._id,
      channelName: channel.channelName,
      uploader: req.user,
    });

    res.status(201).json(video);
  } catch (err) {
    console.error("uploadVideo error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/* ================= UPDATE VIDEO ================= */
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploader.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    video.title = req.body.title || video.title;
    video.description = req.body.description || video.description;
    video.category = req.body.category || video.category;

    await video.save();
    res.json(video);
  } catch (err) {
    console.error("updateVideo error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= DELETE VIDEO ================= */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploader.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await video.deleteOne();
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("deleteVideo error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ================= INCREASE VIEW COUNT ================= */
export const addView = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.views += 1;
    await video.save();

    res.json({ views: video.views });
  } catch (err) {
    console.error("addView error:", err);
    res.status(500).json({ message: "View update failed" });
  }
};

/* ================= LIKE VIDEO ================= */
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.likes += 1;
    await video.save();

    res.json({ likes: video.likes });
  } catch (err) {
    console.error("likeVideo error:", err);
    res.status(500).json({ message: "Like failed" });
  }
};

/* ================= DISLIKE VIDEO ================= */
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.dislikes += 1;
    await video.save();

    res.json({ dislikes: video.dislikes });
  } catch (err) {
    console.error("dislikeVideo error:", err);
    res.status(500).json({ message: "Dislike failed" });
  }
};
