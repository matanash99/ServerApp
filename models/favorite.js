class Favorite {
    constructor({ id, user_id, youtube_id, title, thumbnail_url }) {
        this.id = id;
        this.userId = user_id;
        this.youtubeId = youtube_id;
        this.title = title;
        this.thumbnailUrl = thumbnail_url;
    }
}

module.exports = Favorite;