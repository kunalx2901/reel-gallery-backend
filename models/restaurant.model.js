const pool = require("../config/db");

const createRestaurant = async ({
  restaurantName,
  location,
  description,
  videoUrl,
  thumbnailUrl,
  cuisine,
  rating,
  reviewCount,
  priceRange,
  hours,
  tags,
  chef,
  established,
}) => {
  const query = `
    INSERT INTO restaurants (
      id, restaurant_name, location, description,
      video_url, thumbnail_url, cuisine, rating,
      review_count, price_range, hours, tags, chef, established
    )
    VALUES (
      gen_random_uuid(), $1, $2, $3,
      $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13
    )
    RETURNING *;
  `;
  const values = [
    restaurantName,
    location || null,
    description || null,
    videoUrl || null,
    thumbnailUrl || null,
    cuisine || null,
    rating || 0.0,
    reviewCount || 0,
    priceRange || null,
    hours || null,
    tags || [],
    chef || null,
    established || null,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllRestaurants = async () => {
  const query = `SELECT * FROM restaurants ORDER BY created_at DESC;`;
  const { rows } = await pool.query(query);
  return rows;
};

const getRestaurantById = async (id) => {
  const query = `SELECT * FROM restaurants WHERE id = $1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = { createRestaurant, getAllRestaurants, getRestaurantById };