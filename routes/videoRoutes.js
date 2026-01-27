const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth); // Protect all routes

// 1. Main Page (Matches /videos)
router.get("/", videoController.getVideosPage);

// 2. Search API (Matches /videos/search)
router.get("/search", videoController.searchVideos);

// 3. Actions (Matches /videos/add and /videos/delete)
router.post("/add", videoController.addFavorite);
router.post("/delete", videoController.removeFavorite);

module.exports = router;