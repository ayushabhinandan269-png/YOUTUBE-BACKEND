import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ================= LIKED VIDEOS ================= */
    likedVideos: [
      {
        videoId: {
          type: String,
          required: true,
        },
      },
    ],

    /* ================= WATCH HISTORY ================= */
    watchHistory: [
      {
        videoId: {
          type: String,
          required: true,
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* ================= SUBSCRIPTIONS ================= */
    subscriptions: [
      {
        channelName: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

