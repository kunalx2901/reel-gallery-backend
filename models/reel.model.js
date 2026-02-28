const pool = require("../config/db");

/**
 * Insert a new reel row into the database.
 */
const createReel = async ({ restaurantId, videoUrl }) => {
  const query = `
    INSERT INTO reels (id, restaurant_id, video_url)
    VALUES (gen_random_uuid(), $1, $2)
    RETURNING *;
  `;
  const values = [restaurantId, videoUrl];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Fetch all reels joined with restaurant name and location.
 * Sorted by newest first.
 */
const getAllReels = async () => {
  const query = `
    SELECT
      r.id,
      r.restaurant_id,
      r.video_url,
      r.likes,
      r.views,
      r.created_at,
      res.name  AS restaurant_name,
      res.location AS restaurant_location
    FROM reels r
    JOIN restaurants res ON r.restaurant_id = res.id
    ORDER BY r.created_at DESC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

/**
 * Increment the views count for a reel by 1.
 */
const incrementViews = async (id) => {
  const query = `
    UPDATE reels SET views = views + 1 WHERE id = $1 RETURNING *;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

/**
 * Increment the likes count for a reel by 1.
 */
const incrementLikes = async (id) => {
  const query = `
    UPDATE reels SET likes = likes + 1 WHERE id = $1 RETURNING *;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = { createReel, getAllReels, incrementViews, incrementLikes };
