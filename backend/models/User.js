import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    likedVideos: [
      {
        videoId: String,
      },
    ],

    watchHistory: [
      {
        videoId: String,
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    subscriptions: [
      {
        channelName: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
