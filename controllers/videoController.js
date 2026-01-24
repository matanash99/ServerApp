const favoriteRepo = require("../repositories/favoriteRepository");

exports.getVideosPage = async (req, res) => {
    try {
        // Get the logged-in user's favorites
        const favorites = await favoriteRepo.findByUserId(req.session.user.id);
        
        // Render the view with the favorites list
        res.render("videos", { 
            user: req.session.user,
            favorites: favorites 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching videos");
    }
};

exports.addFavorite = async (req, res) => {
    try {
        const { youtubeId, title, thumbnailUrl } = req.body;
        const userId = req.session.user.id;

        await favoriteRepo.create({ userId, youtubeId, title, thumbnailUrl });
        res.redirect("/videos");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding favorite");
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