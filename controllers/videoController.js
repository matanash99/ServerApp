const favoriteRepo = require("../repositories/favoriteRepository");

const YOUTUBE_API_KEY = "AIzaSyCrAMCoCgoJfkxWYCLZTR1giWkvXeh6S-U"; 
// ==============================

exports.getVideosPage = async (req, res) => {
    try {
        const favorites = await favoriteRepo.findByUserId(req.session.user.id);
        res.render("videos", { 
            user: req.session.user, 
            favorites: favorites 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching videos");
    }
};

exports.searchVideos = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
        );
        const data = await response.json();

        if (data.error) {
            console.error("YouTube API Error:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        res.json(data.items || []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.addFavorite = async (req, res) => {
    try {
        // 1. Get 'youtubeId' from the form
        const { youtubeId, title, thumbnailUrl } = req.body;
        const userId = req.session.user.id;
        
        // 2. Send it to the repo as 'videoId' (to match the DB column)
        await favoriteRepo.create({ 
            userId, 
            videoId: youtubeId, // <--- THIS IS THE FIX
            title, 
            thumbnailUrl 
        });

        res.redirect("/videos");
    } catch (err) {
        console.error("Add Error:", err);
        // If it fails, just reload the page (it probably already exists)
        res.redirect("/videos");
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const { id } = req.body;
        await favoriteRepo.delete(id);
        res.redirect("/videos");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting favorite");
    }
};
