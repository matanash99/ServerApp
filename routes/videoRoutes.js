const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const requireAuth = require("../middleware/requireAuth"); // Assuming you have this from your checklist

// All routes here are protected
router.use(requireAuth);

router.get("/", videoController.getVideosPage);
router.post("/add", videoController.addFavorite);
router.post("/delete", videoController.removeFavorite);

module.exports = router;