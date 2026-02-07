import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    channelId: {
      type: String,
      required: true,
    },

    videos: [
      {
        type: String, // videoId
      },
    ],

    createdBy: {
      type: String, // userId
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", playlistSchema);
