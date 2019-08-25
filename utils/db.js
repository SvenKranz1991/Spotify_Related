var spicedPg = require("spiced-pg");

var dbUrl;
if (process.env.DATABASE_URL) {
    dbUrl = spicedPg(process.env.DATABASE_URL);
} else {
    dbUrl = spicedPg("postgres:postgres:postgres@localhost:5432/spotify");
}

// REGARDING USERS!

exports.addUser = function addUser(
    spotify_id,
    displayName,
    profileUrl,
    email,
    photo
) {
    return dbUrl.query(
        `INSERT INTO users (spotify_id,
        displayName,
        profileUrl,
        email,
        photo)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [spotify_id, displayName, profileUrl, email, photo]
    );
};

exports.getUser = function getUser(email) {
    return dbUrl.query(
        `SELECT spotify_id, displayName, profileUrl, email, photo FROM users WHERE email = $1`,
        [email]
    );
};

exports.updateUser = function updateUser(
    spotify_id,
    displayName,
    profileUrl,
    email,
    photo
) {
    return dbUrl.query(
        `UPDATE users SET spotify_id = $1, displayName = $2, profileUrl = $3, photo = $5 WHERE email = $4`,
        [spotify_id, displayName, profileUrl, email, photo]
    );
};

// REGARDING PLAYLIST CREATED

exports.addPlaylist = function addPlaylist(
    spotify_id,
    playlistName,
    mainArtist,
    artistPic,
    playListUrl
) {
    return dbUrl.query(
        `INSERT INTO playlistscreated (spotify_id,
        playlistName,
        mainArtist,
        artistPic,
        playListUrl)
        VALUES ($1, $2, $3, $4, $5)`,
        [spotify_id, playlistName, mainArtist, artistPic, playListUrl]
    );
};

exports.getPlaylists = function getPlaylists() {
    return dbUrl.query(
        `SELECT * FROM playlistscreated ORDER BY id DESC LIMIT 12`
    );
};

exports.getMorePlaylists = function getMorePlaylists(lastId) {
    return dbUrl.query(
        `SELECT * FROM playlistscreated
        WHERE id <$1
        ORDER BY id DESC
        LIMIT 12`,
        [lastId]
    );
};
