import mongoose from "mongoose";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

/* ================= CREATE CHANNEL ================= */
export const createChannel = async (req, res) => {
  try {
    const { channelName, description } = req.body;

    if (!channelName || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Channel.findOne({ channelName });
    if (exists) {
      return res.status(400).json({ message: "Channel already exists" });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.channel) {
      return res.status(400).json({ message: "User already has a channel" });
    }

    const channel = await Channel.create({
      channelName,
      description,
      owner: user._id,
    });

    user.channel = channel._id;
    await user.save();

    res.status(201).json(channel);
  } catch (err) {
    console.error("createChannel error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LIST CHANNELS ================= */
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .select("channelName avatar subscribers")
      .sort({ createdAt: -1 });

    res.json(channels);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CHANNEL DETAILS ================= */
export const getChannelById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Channel not found" });
  }

  const channel = await Channel.findById(id);
  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }

  res.json(channel);
};

/* ================= CHANNEL VIDEOS ================= */
export const getChannelVideos = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.json([]);

  const channel = await Channel.findById(id);
  if (!channel) return res.json([]);

  const videos = await Video.find({ uploader: channel.owner });
  res.json(videos);
};
