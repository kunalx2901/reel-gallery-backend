const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { uploadReel, getReels, viewReel, likeReel } = require("../controllers/reel.controller");

router.post("/", upload.single("video"), uploadReel);
router.get("/", getReels);
router.post("/:id/view", viewReel);
router.post("/:id/like", likeReel);

module.exports = router;
