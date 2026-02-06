import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avatar: {
      type: String,
    },
    banner: {
      type: String,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);

