const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const {
  addRestaurant,
  getRestaurants,
  getRestaurant,
} = require("../controllers/restaurant.controller");

// Accept both video and thumbnail in one request
router.post("/", upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]), addRestaurant);

router.get("/", getRestaurants);
router.get("/:id", getRestaurant);

module.exports = router;