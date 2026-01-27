const db = require("../config/db");

class FavoriteRepository {
    async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            // FIX 1: Query using 'user_id' (Database name)
            db.all(
                `SELECT * FROM Favorites WHERE user_id = ? ORDER BY id DESC`,
                [userId],
                (err, rows) => {
                    if (err) return reject(err);

                    // FIX 2: Convert DB results to App format
                    // user_id -> userId
                    // youtube_id -> videoId
                    const videos = rows.map(row => ({
                        id: row.id,
                        userId: row.user_id,
                        videoId: row.youtube_id || row.videoId, // Handle both just in case
                        title: row.title,
                        thumbnailUrl: row.thumbnail_url || row.thumbnailUrl
                    }));
                    
                    resolve(videos);
                }
            );
        });
    }

    async create({ userId, videoId, title, thumbnailUrl }) {
        return new Promise((resolve, reject) => {
            // FIX 3: Insert using 'user_id' and 'youtube_id'
            db.run(
                `INSERT INTO Favorites (user_id, youtube_id, title, thumbnail_url) VALUES (?, ?, ?, ?)`,
                [userId, videoId, title, thumbnailUrl],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

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