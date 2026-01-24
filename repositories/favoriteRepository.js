const db = require("../config/db");
const Favorite = require("../models/favorite");

class FavoriteRepository {
    // Get all favorites for a specific user
    async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM Favorites WHERE user_id = ? ORDER BY id DESC`,
                [userId],
                (err, rows) => {
                    if (err) return reject(err);
                    const favorites = rows.map((row) => new Favorite(row));
                    resolve(favorites);
                }
            );
        });
    }

    // Add a new favorite
    async create({ userId, youtubeId, title, thumbnailUrl }) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Favorites (user_id, youtube_id, title, thumbnail_url) VALUES (?, ?, ?, ?)`,
                [userId, youtubeId, title, thumbnailUrl],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    // Remove a favorite
    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM Favorites WHERE id = ?`, [id], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = new FavoriteRepository();