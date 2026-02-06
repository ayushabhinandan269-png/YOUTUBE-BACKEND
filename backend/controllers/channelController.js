import mongoose from "mongoose";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";

/* ================= CREATE CHANNEL ================= */
export const createChannel = async (req, res) => {
  try {
    const { channelName, description } = req.body;

    const exists = await Channel.findOne({ channelName });
    if (exists) {
      return res.status(400).json({ message: "Channel already exists" });
    }

    const channel = await Channel.create({
      channelName,
      description,
      owner: req.user._id,
    });

    res.status(201).json(channel);
  } catch (err) {
    console.error("createChannel error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL CHANNELS (SIDEBAR) ================= */
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .select("channelName avatar subscribers")
      .sort({ createdAt: -1 });

    res.json(channels);
  } catch (err) {
    console.error("getAllChannels error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET CHANNEL BY ID ================= */
export const getChannelById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const channel = await Channel.findById(id);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.json(channel);
  } catch (err) {
    console.error("getChannelById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET CHANNEL VIDEOS ================= */
export const getChannelVideos = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json([]);
    }

    const channel = await Channel.findById(id);
    if (!channel) {
      return res.json([]);
    }

    const videos = await Video.find({ uploader: channel.owner });
    res.json(videos);
  } catch (err) {
    console.error("getChannelVideos error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
