const cloudinary = require("../config/cloudinary");
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
} = require("../models/restaurant.model");

// Helper: upload any file buffer to Cloudinary
const uploadToCloudinary = (buffer, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "reel-gallery" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * POST /api/restaurants
 * Accepts multipart/form-data with video + thumbnail files
 */
const addRestaurant = async (req, res) => {
  try {
    const {
      restaurantName,
      location,
      description,
      cuisine,
      rating,
      reviewCount,
      priceRange,
      hours,
      tags,
      chef,
      established,
    } = req.body;

    if (!restaurantName || restaurantName.trim() === "") {
      return res.status(400).json({ error: "restaurantName is required" });
    }

    // Upload video to Cloudinary if provided
    let videoUrl = null;
    if (req.files && req.files["video"]) {
      const videoResult = await uploadToCloudinary(
        req.files["video"][0].buffer,
        "video"
      );
      videoUrl = videoResult.secure_url;
    }

    // Upload thumbnail to Cloudinary if provided
    let thumbnailUrl = null;
    if (req.files && req.files["thumbnail"]) {
      const thumbResult = await uploadToCloudinary(
        req.files["thumbnail"][0].buffer,
        "image"
      );
      thumbnailUrl = thumbResult.secure_url;
    }

    // Parse tags if sent as JSON string e.g. '["Brunch","Vegan"]'
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    }

    const restaurant = await createRestaurant({
      restaurantName: restaurantName.trim(),
      location,
      description,
      videoUrl,
      thumbnailUrl,
      cuisine,
      rating: parseFloat(rating) || 0.0,
      reviewCount: parseInt(reviewCount) || 0,
      priceRange,
      hours,
      tags: parsedTags,
      chef,
      established,
    });

    return res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    console.error("addRestaurant error:", err.message);
    return res.status(500).json({ error: "Failed to create restaurant" });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await getAllRestaurants();
    return res.status(200).json({ success: true, data: restaurants });
  } catch (err) {
    console.error("getRestaurants error:", err.message);
    return res.status(500).json({ error: "Failed to fetch restaurants" });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const restaurant = await getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    return res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    console.error("getRestaurant error:", err.message);
    return res.status(500).json({ error: "Failed to fetch restaurant" });
  }
};

module.exports = { addRestaurant, getRestaurants, getRestaurant };