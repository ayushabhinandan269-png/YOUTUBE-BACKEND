import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    /* ================= VIDEO IDENTIFIER ================= */
    videoId: {
      type: String,
      required: true,
      unique: true,
    },

    /* ================= BASIC INFO ================= */
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    thumbnailUrl: {
      type: String,
      required: true,
    },

    /* ================= CHANNEL INFO ================= */
    channelName: {
      type: String,
      required: true,
    },

    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },

    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= STATS ================= */
    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    dislikes: {
      type: Number,
      default: 0,
    },

    /* ================= CATEGORY ================= */
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
