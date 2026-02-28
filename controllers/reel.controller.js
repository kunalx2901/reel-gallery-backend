const cloudinary = require("../config/cloudinary");
const { createReel, getAllReels, incrementViews, incrementLikes } = require("../models/reel.model");

/**
 * Wraps Cloudinary's upload_stream in a Promise so we can use async/await.
 * Pipes the in-memory file buffer directly to Cloudinary — no disk I/O needed.
 *
 * @param {Buffer} buffer - File buffer from Multer memory storage
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "reel-gallery",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * POST /api/reels
 * Accepts multipart/form-data with a video file and restaurantId.
 * Uploads video to Cloudinary and saves metadata to DB.
 */
const uploadReel = async (req, res) => {
  try {
    const { restaurantId } = req.body;

    if (!restaurantId || restaurantId.trim() === "") {
      return res.status(400).json({ error: "restaurantId is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Video file is required" });
    }

    // Upload buffer to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

    // Save reel metadata in PostgreSQL
    const reel = await createReel({
      restaurantId: restaurantId.trim(),
      videoUrl: cloudinaryResult.secure_url,
    });

    return res.status(201).json({ success: true, data: reel });
  } catch (err) {
    console.error("uploadReel error:", err.message);
    return res.status(500).json({ error: "Failed to upload reel" });
  }
};

/**
 * GET /api/reels
 * Returns all reels joined with restaurant info, newest first.
 */
const getReels = async (req, res) => {
  try {
    const reels = await getAllReels();
    return res.status(200).json({ success: true, data: reels });
  } catch (err) {
    console.error("getReels error:", err.message);
    return res.status(500).json({ error: "Failed to fetch reels" });
  }
};

/**
 * POST /api/reels/:id/view
 * Increments the view count of a reel.
 */
const viewReel = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await incrementViews(id);

    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    return res.status(200).json({ success: true, data: reel });
  } catch (err) {
    console.error("viewReel error:", err.message);
    return res.status(500).json({ error: "Failed to increment views" });
  }
};

/**
 * POST /api/reels/:id/like
 * Increments the like count of a reel.
 */
const likeReel = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await incrementLikes(id);

    if (!reel) {
      return res.status(404).json({ error: "Reel not found" });
    }

    return res.status(200).json({ success: true, data: reel });
  } catch (err) {
    console.error("likeReel error:", err.message);
    return res.status(500).json({ error: "Failed to increment likes" });
  }
};

module.exports = { uploadReel, getReels, viewReel, likeReel };
