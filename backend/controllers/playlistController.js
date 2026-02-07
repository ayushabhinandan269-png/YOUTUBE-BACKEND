import Playlist from "../models/Playlist.js";

/* ================= CREATE PLAYLIST ================= */
export const createPlaylist = async (req, res) => {
  try {
    const { title, description, channelId } = req.body;

    const playlist = await Playlist.create({
      title,
      description,
      channelId,
      createdBy: req.user.id,
      videos: [],
    });

    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to create playlist" });
  }
};

/* ================= ADD VIDEO TO PLAYLIST ================= */
export const addVideoToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { videoId } = req.body;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
    }

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to add video" });
  }
};

/* ================= GET CHANNEL PLAYLISTS ================= */
export const getChannelPlaylists = async (req, res) => {
  try {
    const { channelId } = req.params;

    const playlists = await Playlist.find({ channelId }).sort({
      createdAt: -1,
    });

    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch playlists" });
  }
};

/* ================= GET SINGLE PLAYLIST ================= */
export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch playlist" });
  }
};

/* ================= DELETE PLAYLIST ================= */
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.createdBy !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await playlist.deleteOne();
    res.json({ message: "Playlist deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete playlist" });
  }
};
