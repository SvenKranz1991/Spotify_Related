// SERVER SETUP

const express = require("express");
const session = require("express-session");
const app = express();
const compression = require("compression");

app.use(compression());

app.use(require("body-parser").json());
const cookieParser = require("cookie-parser");
const csurf = require("csurf");

// FROM SPOTIFY DOCUMENTATION
// https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js

var request = require("request"); // "Request" library
var cors = require("cors");
var querystring = require("querystring");

// COOKIE SESSION

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

app.use("/favicon.ico", (req, res) => res.sendStatus(404));
app.use(cookieParser());

app.use(csurf());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

////// Encoding base64url

const image2base64 = require("image-to-base64");

// SERVING AND REQUIRING FOLDERS, FILES, MIDDLEWARES

app.use(express.static("./public"));

const sptfy = require("./utils/sptfy-middleware");
const db = require("./utils/db");
// const bc = require("./utils/bc");

// SETUP Passport

const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
var consolidate = require("consolidate");

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

/////////////////// SETUP Spotify-Web-Api-Node //////////////////////////////

const SpotifyWebApi = require("spotify-web-api-node");

// credentials are optional
const spotifyApi = new SpotifyWebApi({
    clientId: "fcecfc72172e4cd267473117a17cbd4d",
    clientSecret: "a6338157c9bb5ac9c71924cb2940e1a7",
    redirectUri: "http://www.example.com/callback"
});

////////////////////// MY SPOTIFY CREDENTIALS ///////////////////////////////

const { Client_ID, Client_Secret } = require("./secrets");

////////////////////// MY ACCESS TOKEN ////////////////////////////////////

let userAccessToken = "";
console.log("userAccessToken: ", userAccessToken);

/////////////////////// USER Email

let userEmail = "";

/////////////////////// PASSPORT use

passport.use(
    new SpotifyStrategy(
        {
            clientID: Client_ID,
            clientSecret: Client_Secret,
            callbackURL: "http://localhost:8080/callback"
        },
        function(accessToken, refreshToken, expires_in, profile, done) {
            console.log("uAT in Use: ", userAccessToken);

            // asynchronous verification, for effect...
            process.nextTick(function() {
                userAccessToken = accessToken;
                userEmail = profile.emails[0].value;

                spotifyApi.setAccessToken(accessToken);

                db.addUser(
                    profile.id,
                    profile.displayName,
                    profile.profileUrl,
                    profile.emails[0].value,
                    profile.photos[0]
                )
                    .then(() => {
                        console.log("Added to db!");
                    })
                    .catch(() => {
                        console.log("Error in Adding try Update!");
                        db.updateUser(
                            profile.id,
                            profile.displayName,
                            profile.profileUrl,
                            profile.emails[0].value,
                            profile.photos[0]
                        )
                            .then(() => {
                                console.log("Updated User!");
                            })
                            .catch(err => {
                                console.log("Error in updating User: ", err);
                            });
                    });
                // To keep the example simple, the user's spotify profile is returned to
                // represent the logged-in user. In a typical application, you would want
                // to associate the spotify account with a user record in your database,
                // and return that user instead.

                return done(null, profile);
            });
        }
    )
);

app.use(
    session({
        secret: "for the love of god",
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

//////////// Image base SETUP

var base64Img = require("base64-img");

let userImage = base64Img.base64("public/images/myimage.jpeg", function(
    err,
    data
) {
    console.log("My error in iamge: ", err);
    return data;
});

//////////////////////// Authentication Process //////////////////////////

app.get(
    "/",
    passport.authenticate("spotify", {
        scope: [
            "user-read-email",
            "user-read-private",
            "user-follow-read",
            "playlist-modify-private",
            "playlist-modify-public",
            "ugc-image-upload"
        ],
        showDialog: true
    }),
    function(req, res) {
        // The request will be redirected to spotify for authentication, so this
        // function will not be called.
        console.log("It will never!");
    }
);

app.get(
    "/callback",
    passport.authenticate("spotify", { failureRedirect: "/login" }),
    function(req, res) {
        res.redirect("/app");
    }
);

///////////////////// GET ROUTES FOR WEBSITE ///////////////////////////

app.get("/app", ensureAuthenticated, async (req, res) => {
    console.log("I'm in app!");
    console.log("uAT in App Page: ", userAccessToken);
    res.sendFile(__dirname + "/index.html");
});

app.get("/access", async (req, res) => {
    try {
        const userProfile = await db.getUser(userEmail);
        console.log("My User Profile: ", userProfile.rows[0]);
        console.log("Type of userProfile: ", typeof userProfile.rows[0]);
        req.session.spotify_id = userProfile.rows[0].spotify_id;

        res.json({
            token: userAccessToken,
            user: userProfile.rows[0]
        });
    } catch (err) {
        console.log("My Error in access: ", err);
    }
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//////////////////// POST ROUTES FOR WEBSITE ////////////////////////////

// let userImage;
// image2base64("public/images/myimage.png") // you can also to use url
//     .then(response => {
//         console.log("Done"); //cGF0aC90by9maWxlLmpwZw==
//         return (userImage = response);
//     })
//     .catch(error => {
//         console.log(error); //Exepection error....
//     });
//
// console.log("My encoded UserImage: ", userImage);

////////////////// REQUESTS FOR APP ////////////////////////////////////

app.get("/artistName/:artistName.json", async (req, res) => {
    // console.log("My Request Body: ", req.body);
    let artistName = req.params.artistName;

    console.log("Getting Input from Seaching Artist Field!");
    console.log("Artist Name: ", artistName);

    spotifyApi
        .searchArtists(artistName)
        .then(
            function(data) {
                console.log("Search artists:", data.body.artists.items[0]);
                console.log(
                    "Found Artist Name: ",
                    data.body.artists.items[0].name
                );
                console.log(
                    "Image of Artist: ",
                    data.body.artists.items[0].images[0].url
                );
                console.log("Id of Artist: ", data.body.artists.items[0].id);

                res.json({
                    SearchArtistPicture:
                        data.body.artists.items[0].images[0].url,
                    IdOfArtist: data.body.artists.items[0].id,
                    SearchArtistName: data.body.artists.items[0].name
                });
            },
            function(err) {
                console.error(err);
            }
        )
        .catch(err => {
            console.log("Error in getting Artist: ", err);
            res.json({
                ooops: true
            });
        });
});

app.get("/getRelatedArtists/:artistId.json", function(req, res) {
    let artistId = req.params.artistId;
    // console.log("Log my Artist Id in get Related: ", artistId);

    spotifyApi.getArtistRelatedArtists(artistId).then(
        function(data) {
            // console.log("Something Happened");
            // console.log(data.body);
            console.log(data.body.artists);

            const mappedArtists = data.body.artists.map(eachArtist => {
                const {
                    name,
                    id,
                    images,
                    uri,
                    external_urls,
                    followers,
                    popularity
                } = eachArtist;

                const linkToSpotify = external_urls.spotify;
                const artistImage = images.slice(0, 1);
                const artistImageLink = artistImage[0].url;
                const followers_value = followers.total;

                return {
                    name,
                    id,
                    artistImageLink,
                    uri,
                    linkToSpotify,
                    followers_value,
                    popularity
                };
            });

            const mappedArtistsId = data.body.artists.map(eachArtist => {
                const { id } = eachArtist;

                return { id };
            });
            // console.log("MappedArtists: ", mappedArtists);
            // console.log("MappedArtistsId: ", mappedArtistsId);
        },
        function(err) {
            console.log("Error in getting related Artist: ", err);
        }
    );
});

app.get("/topTracksOfEachArtist/:artistId.json", function(req, res) {
    let artistId = req.params.artistId;
    console.log("Something Happened");

    spotifyApi.getArtistTopTracks(artistId, "from_token").then(
        function(data) {
            console.log(data.body.tracks);
            const mappedTracks = data.body.tracks.map(eachTrack => {
                const { name, popularity, id } = eachTrack;

                return {
                    name,
                    id,
                    popularity
                };
            });
            const mappedTracksId = data.body.tracks.map(eachTrack => {
                const { id } = eachTrack;
                return { id };
            });
            console.log("MappedTracks: ", mappedTracks);
            console.log("MappedTracksId: ", mappedTracksId);
        },
        function(err) {
            console.log("Something went wrong!", err);
        }
    );
});

app.get("/createPlaylist/:playListName.json", function(req, res) {
    let playListName = req.params.playListName;

    spotifyApi
        .createPlaylist(
            req.session.spotify_id,
            `${playListName}: created by PLG`,
            {
                public: true
            }
        )
        .then(
            function(data) {
                console.log("Created playlist!");

                let { external_urls, name, id, uri } = data.body;

                res.json({
                    linkToPlayList: external_urls.spotify,
                    playListName: name,
                    playListId: id,
                    playListUri: uri
                });
            },
            function(err) {
                console.log("Something went wrong!", err);
            }
        );
});

// DOESNT WORK

// spotifyApi.uploadCustomPlaylistCoverImage(id, userImage).then(
//     function(data) {
//         console.log("Data for Upload Image: ", data);
//         console.log("Playlsit cover image uploaded!");
//
//     },
//     function(err) {
//         console.log("Something went wrong!", err);
//     }
// );

// FROM SOCIAL

// app.get("*", function(req, res) {
//     if (!req.session.userId && req.url != "/welcome") {
//         res.redirect("/welcome");
//     } else {
//         res.sendFile(__dirname + "/index.html");
//     }
// });

// !!!!!ALWAYS BE AT BOTTOM!!!!!
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    console.log("I'm listening on 8080.");
});

//////////// Middleware ensures Auth ////////////////

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Req.isAuthenticated", req.isAuthenticated());
        return next();
    }
    res.redirect("/");
}
