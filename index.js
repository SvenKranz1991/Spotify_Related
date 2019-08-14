const express = require("express");
const session = require("express-session");
const app = express();
const compression = require("compression");

app.use(compression());

app.use(require("body-parser").json());
const cookieParser = require("cookie-parser");
const csurf = require("csurf");

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
            "user-top-read",
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
        // console.log("My User Profile: ", userProfile.rows[0]);
        // console.log("Type of userProfile: ", typeof userProfile.rows[0]);
        req.session.spotify_id = userProfile.rows[0].spotify_id;

        res.json({
            token: userAccessToken,
            user: userProfile.rows[0]
        });
    } catch (err) {
        console.log("My Error in access: ", err);
    }
});

app.get("/app/userTopArtists", async (req, res) => {
    spotifyApi
        .getMyTopArtists()
        .then(result => {
            // console.log("My Top Artists: ", result.body.items);

            const mappedArtists = result.body.items.map(eachArtist => {
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

            let topArtistsList = mappedArtists
                .sort(() => 0.5 - Math.random())
                .slice(0, 5);

            // console.log("My Top Artists List: ", topArtistsList);

            res.json(topArtistsList);
        })
        .catch(err => {
            console.log("My error in Top Artists: ", err);
        });
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
    let artistName = req.params.artistName;

    spotifyApi
        .searchArtists(artistName)
        .then(
            function(data) {
                let searchArtistNameExact = data.body.artists.items.filter(
                    exactArtist => {
                        return exactArtist.name == artistName;
                    }
                );

                let searchArtistId = searchArtistNameExact[0].id;

                let artistPicUrlForTable =
                    searchArtistNameExact[0].images[0].url;

                res.json({
                    SearchArtistPicture: artistPicUrlForTable,
                    IdOfArtist: searchArtistId,
                    SearchArtistName: data.body.artists.items[0].name,
                    SearchArtistUrl:
                        searchArtistNameExact[0].external_urls.spotify
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
    console.log(req.params.artistId);

    spotifyApi.getArtistRelatedArtists(artistId).then(
        function(data) {
            console.log(data.body.artists);

            const mappedArtists = data.body.artists.map(eachArtist => {
                const {
                    name,
                    id,
                    images,
                    uri,
                    external_urls,
                    followers,
                    popularity,
                    genres
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
                    popularity,
                    genres
                };
            });

            const mappedArtistsId = data.body.artists.map(eachArtist => {
                const { id } = eachArtist;

                return { id };
            });
            // console.log("MappedArtists: ", mappedArtists);
            // console.log("MappedArtistsId: ", mappedArtistsId);

            res.json({
                wholeArtistsId: mappedArtistsId,
                mappedRelativeArtists: mappedArtists
            });
        },
        function(err) {
            console.log("Error in getting related Artist: ", err);
        }
    );
});

app.get("/topTracksOfEachArtist/:artistId.json", function(req, res) {
    let artistId = req.params.artistId;
    // console.log("Something Happened");

    spotifyApi.getArtistTopTracks(artistId, "from_token").then(
        function(data) {
            // console.log(data.body.tracks);
            const slicedTracksArray = data.body.tracks.slice(0, 3);
            // console.log("slicedTracksArray: ", slicedTracksArray);
            const mappedTracks = slicedTracksArray.map(eachTrack => {
                const { name, popularity, id, uri } = eachTrack;

                return {
                    name,
                    id,
                    popularity,
                    uri
                };
            });
            const mappedTracksId = slicedTracksArray.map(eachTrack => {
                const { uri } = eachTrack;
                return { uri };
            });

            // YAY RIGHT FORMAT -- allArray
            const trackIdsFormat = mappedTracksId.map(eachTrack => {
                // console.log("For Format: ", eachTrack);
                return eachTrack["uri"];
            });

            // const trackIdsFormatTwo = mappedTracksId.map(eachTrack => {
            //     console.log("For Format: ", eachTrack);
            //     return eachTrack["uri"];
            // });
            // console.log("MappedTracks: ", mappedTracks);
            // console.log("MappedTracksId: ", mappedTracksId);
            // console.log("TrackIdsFormat: ", trackIdsFormat);
            // console.log("TrackIdsFormatTwo: ", trackIdsFormatTwo);
            // const allArray = trackIdsFormat.concat(trackIdsFormatTwo);
            // console.log("Now it should be merged: ", allArray);
        },
        function(err) {
            console.log("Something went wrong!", err);
        }
    );
});

app.get("/createPlaylist/:playListName.json/:artistId.json", function(
    req,
    res
) {
    let artistName = req.params.playListName;
    let artistId = req.params.artistId;

    spotifyApi.searchArtists(artistName).then(
        function(data) {
            // console.log("data.body.artists: ", data.body.artists);
            // Filtering out the property that is exactly like Search Name

            let searchArtistNameExact = data.body.artists.items.filter(
                exactArtist => {
                    return exactArtist.name == artistName;
                }
            );

            let searchArtistId = searchArtistNameExact[0].id;

            let artistPicUrlForTable = searchArtistNameExact[0].images[0].url;

            console.log(
                "SearchArtistName: ",
                searchArtistNameExact[0].name,
                " SearchArtistId: ",
                searchArtistId,
                " SearchArtistPicUrl: ",
                artistPicUrlForTable
            );

            spotifyApi
                .getArtistRelatedArtists(searchArtistId)
                .then(
                    function(data) {
                        let newList = data.body.artists;

                        const mappedArtistsId = newList.map(eachArtist => {
                            const { id } = eachArtist;

                            return { id };
                        });

                        const mappedArtistsIdFormat = mappedArtistsId.map(
                            eachTrack => {
                                return eachTrack["id"];
                            }
                        );

                        Promise.all([
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[0]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[1]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[2]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[3]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[4]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[5]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[6]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[7]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[8]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[9]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[10]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[11]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[12]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[13]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[14]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[15]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[16]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[17]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[18]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[19])
                        ]).then(results => {
                            // console.log("My Results: ", results);

                            let myTrackIdArray = results[0].concat(
                                results[1],
                                results[2],
                                results[3],
                                results[4],
                                results[5],
                                results[6],
                                results[7],
                                results[8],
                                results[9],
                                results[10],
                                results[11],
                                results[12],
                                results[13],
                                results[14],
                                results[15],
                                results[16],
                                results[17],
                                results[18],
                                results[19]
                            );

                            // console.log("MyTrackIdArray: ", myTrackIdArray);

                            // Creating PlayList

                            spotifyApi
                                .createPlaylist(
                                    req.session.spotify_id,
                                    `${artistName} | Related Artists created by Sven`,
                                    {
                                        public: true
                                    }
                                )
                                .then(
                                    function(data) {
                                        console.log("Created playlist!");

                                        let {
                                            external_urls,
                                            name,
                                            id,
                                            uri
                                        } = data.body;

                                        let spotify_id = req.session.spotify_id;
                                        let mainArtist = artistName;
                                        let playlistName = `${artistName} | Related Artists created by Sven`;
                                        let artistPic = artistPicUrlForTable;
                                        let playListUrl = uri;

                                        spotifyApi
                                            .addTracksToPlaylist(
                                                id,
                                                myTrackIdArray
                                            )
                                            .then(
                                                function(data) {
                                                    // console.log(
                                                    //     "Added tracks to playlist!"
                                                    // );

                                                    // Add Playlist to Database

                                                    db.addPlaylist(
                                                        spotify_id,
                                                        playlistName,
                                                        mainArtist,
                                                        artistPic,
                                                        playListUrl
                                                    ).then(result => {
                                                        // console.log(
                                                        //     "Playlistdata in Table: ",
                                                        //     result
                                                        // );

                                                        db.getPlaylists().then(
                                                            playlists => {
                                                                console.log(
                                                                    "Done!"
                                                                );
                                                            }
                                                        );
                                                    });
                                                },
                                                function(err) {
                                                    console.log(
                                                        "Something went wrong!",
                                                        err
                                                    );
                                                }
                                            );

                                        res.json({
                                            linkToPlayList:
                                                external_urls.spotify,
                                            playListName: name,
                                            playListId: id,
                                            playListUri: uri,
                                            wholeIds: myTrackIdArray,
                                            mappedArtistsIdFormat: mappedArtistsIdFormat
                                        });
                                    },
                                    function(err) {
                                        console.log(
                                            "Something went wrong!",
                                            err
                                        );
                                    }
                                );
                        });
                    },
                    function(err) {
                        console.error(err);
                    }
                )
                .catch(err => {
                    console.log("Error in getting Artist: ", err);
                });
        }, // GOT ALL RELATED ARTIST ID
        function(err) {
            console.log("Error in getting related Artist: ", err);
        }
    ); // CLOSE SPOTIFY GET RELATED ARTIST
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

////////////////////////////// ONE HUGE ROUTE ///////////////////////////

app.get("/createPlaylistOutOfName/:artistName.json", function(req, res) {
    let artistName = req.params.artistName;

    spotifyApi.searchArtists(artistName).then(
        function(data) {
            // console.log("data.body.artists: ", data.body.artists);
            // Filtering out the property that is exactly like Search Name

            let searchArtistNameExact = data.body.artists.items.filter(
                exactArtist => {
                    return exactArtist.name == artistName;
                }
            );

            let searchArtistId = searchArtistNameExact[0].id;

            let artistPicUrlForTable = searchArtistNameExact[0].images[0].url;

            console.log(
                "SearchArtistName: ",
                searchArtistNameExact[0].name,
                " SearchArtistId: ",
                searchArtistId,
                " SearchArtistPicUrl: ",
                artistPicUrlForTable
            );

            spotifyApi
                .getArtistRelatedArtists(searchArtistId)
                .then(
                    function(data) {
                        let newList = data.body.artists;

                        const mappedArtistsId = newList.map(eachArtist => {
                            const { id } = eachArtist;

                            return { id };
                        });

                        const mappedArtistsIdFormat = mappedArtistsId.map(
                            eachTrack => {
                                return eachTrack["id"];
                            }
                        );

                        Promise.all([
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[0]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[1]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[2]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[3]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[4]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[5]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[6]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[7]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[8]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[9]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[10]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[11]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[12]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[13]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[14]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[15]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[16]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[17]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[18]),
                            getIdOfTracksForPlaylist(mappedArtistsIdFormat[19])
                        ]).then(results => {
                            // console.log("My Results: ", results);

                            let myTrackIdArray = results[0].concat(
                                results[1],
                                results[2],
                                results[3],
                                results[4],
                                results[5],
                                results[6],
                                results[7],
                                results[8],
                                results[9],
                                results[10],
                                results[11],
                                results[12],
                                results[13],
                                results[14],
                                results[15],
                                results[16],
                                results[17],
                                results[18],
                                results[19]
                            );

                            // console.log("MyTrackIdArray: ", myTrackIdArray);

                            // Creating PlayList

                            spotifyApi
                                .createPlaylist(
                                    req.session.spotify_id,
                                    `${artistName} | Related Artists created by Sven`,
                                    {
                                        public: true
                                    }
                                )
                                .then(
                                    function(data) {
                                        console.log("Created playlist!");

                                        let {
                                            external_urls,
                                            name,
                                            id,
                                            uri
                                        } = data.body;

                                        let spotify_id = req.session.spotify_id;
                                        let mainArtist = artistName;
                                        let playlistName = `${artistName} | Related Artists created by Sven`;
                                        let artistPic = artistPicUrlForTable;
                                        let playListUrl = uri;

                                        spotifyApi
                                            .addTracksToPlaylist(
                                                id,
                                                myTrackIdArray
                                            )
                                            .then(
                                                function(data) {
                                                    // console.log(
                                                    //     "Added tracks to playlist!"
                                                    // );

                                                    // Add Playlist to Database

                                                    db.addPlaylist(
                                                        spotify_id,
                                                        playlistName,
                                                        mainArtist,
                                                        artistPic,
                                                        playListUrl
                                                    ).then(result => {
                                                        // console.log(
                                                        //     "Playlistdata in Table: ",
                                                        //     result
                                                        // );

                                                        db.getPlaylists().then(
                                                            playlists => {
                                                                console.log(
                                                                    "Done!"
                                                                );
                                                            }
                                                        );
                                                    });
                                                },
                                                function(err) {
                                                    console.log(
                                                        "Something went wrong!",
                                                        err
                                                    );
                                                }
                                            );

                                        spotifyApi.res.json({
                                            linkToPlayList:
                                                external_urls.spotify,
                                            playListName: name,
                                            playListId: id,
                                            playListUri: uri,
                                            wholeIds: myTrackIdArray
                                        });
                                    },
                                    function(err) {
                                        console.log(
                                            "Something went wrong!",
                                            err
                                        );
                                    }
                                );
                        });
                    },
                    function(err) {
                        console.error(err);
                    }
                )
                .catch(err => {
                    console.log("Error in getting Artist: ", err);
                });
        }, // GOT ALL RELATED ARTIST ID
        function(err) {
            console.log("Error in getting related Artist: ", err);
        }
    ); // CLOSE SPOTIFY GET RELATED ARTIST
});

app.get("/app/getPlaylists", function(req, res) {
    db.getPlaylists().then(playlists => {
        // console.log("My Playlists: ", playlists.rows);
        res.json(playlists.rows);
    });
});

app.get("/trackList", function(req, res) {
    let tracklist = req.query.tracks;
    let artistIds = req.query.artistIds;

    Promise.all([
        getInfoOfTracksForPlaylist(artistIds[0]),
        getInfoOfTracksForPlaylist(artistIds[1]),
        getInfoOfTracksForPlaylist(artistIds[2]),
        getInfoOfTracksForPlaylist(artistIds[3]),
        getInfoOfTracksForPlaylist(artistIds[4]),
        getInfoOfTracksForPlaylist(artistIds[5]),
        getInfoOfTracksForPlaylist(artistIds[6]),
        getInfoOfTracksForPlaylist(artistIds[7]),
        getInfoOfTracksForPlaylist(artistIds[8]),
        getInfoOfTracksForPlaylist(artistIds[9]),
        getInfoOfTracksForPlaylist(artistIds[10]),
        getInfoOfTracksForPlaylist(artistIds[11]),
        getInfoOfTracksForPlaylist(artistIds[12]),
        getInfoOfTracksForPlaylist(artistIds[13]),
        getInfoOfTracksForPlaylist(artistIds[14]),
        getInfoOfTracksForPlaylist(artistIds[15]),
        getInfoOfTracksForPlaylist(artistIds[16]),
        getInfoOfTracksForPlaylist(artistIds[17]),
        getInfoOfTracksForPlaylist(artistIds[18]),
        getInfoOfTracksForPlaylist(artistIds[19])
    ])
        .then(results => {
            let trackInfoList = results[0].concat(
                results[1],
                results[2],
                results[3],
                results[4],
                results[5],
                results[6],
                results[7],
                results[8],
                results[9],
                results[10],
                results[11],
                results[12],
                results[13],
                results[14],
                results[15],
                results[16],
                results[17],
                results[18],
                results[19]
            );

            const formatTrackInfoList = trackInfoList.map(eachTrack => {
                const {
                    id,
                    uri,
                    name,
                    artists,
                    popularity,
                    external_urls,
                    album
                } = eachTrack;

                const linkToSpotify = external_urls.spotify;
                const artistImage = album.images.slice(0, 1);
                const trackImageLink = artistImage[0].url;
                const interpret = artists[0].name;

                return {
                    id,
                    uri,
                    name,
                    interpret,
                    popularity,
                    linkToSpotify,
                    trackImageLink
                };
            });

            res.json({
                formatTrackInfoList
            });

            console.log("My Track Info List: ", formatTrackInfoList);
        })
        .catch(err => {
            console.log("Catch my info Error: ", err);
        });
    // console.log("My Results: ", results);

    // console.log("Tracklist: ", tracklist);
    // console.log("ArtistIds: ", artistIds);
    // console.log("Req: ", req.query.artistIds);

    // let newTrackList = tracklist.map(track => {
    //     let slicedTrackName = track.slice(14);
    //
    //     return slicedTrackName;
    // });

    // console.log("NewTrackList: ", newTrackList);
    // spotifyApi.getTracks(newTrackList, "from_token").then(
    //     function(data) {
    //         console.log("TrackList: ", data.body.tracks);
    //     },
    //     function(err) {
    //         console.log("Error in getting Tracklsit: ", err);
    //     }
    // );
    // spotifyApi.getAudioFeaturesForTracks(["2WMRd3xAb9FwXopCRNWDq1"]).then(
    //     function(data) {
    //         console.log("Audio Features: ", data.body);
    //     },
    //     function(err) {
    //         console.log("Error in getting Tracklist", err);
    //     }
    // );
});

// waaay to complicated

// spotifyApi.getAudioAnalysisForTrack("2WMRd3xAb9FwXopCRNWDq1").then(
//     function(data) {
//         console.log("Audio Analysis: ", data.body);
//     },
//     function(err) {
//         console.log("Error in getting Analysis", err);
//     }
// );

/////////////////////// WRITE FUNCTION FOR GETTING TRACKS

function getIdOfTracksForPlaylist(artistName) {
    return new Promise((resolve, reject) => {
        spotifyApi.getArtistTopTracks(artistName, "from_token").then(
            function(data) {
                // console.log("DATA: ", data.body.tracks);
                const slicedTracksArray = data.body.tracks.slice(0, 3);

                const mappedTracksId = slicedTracksArray.map(eachTrack => {
                    const { uri } = eachTrack;
                    return { uri };
                });

                const trackIdsFormat = mappedTracksId.map(eachTrack => {
                    return eachTrack["uri"];
                });

                // console.log(trackIdsFormat);
                resolve(trackIdsFormat);
            },
            function(err) {
                console.log("Something went wrong!", err);
                reject(err);
            }
        );
    });
}

function getInfoOfTracksForPlaylist(artistName) {
    return new Promise((resolve, reject) => {
        spotifyApi.getArtistTopTracks(artistName, "from_token").then(
            function(data) {
                const slicedTracksArray = data.body.tracks.slice(0, 3);

                // console.log("Tracks: ", slicedTracksArray);
                // const mappedTracksId = slicedTracksArray.map(eachTrack => {
                //     const { uri } = eachTrack;
                //     return { uri };
                // });
                //
                // const trackIdsFormat = mappedTracksId.map(eachTrack => {
                //     return eachTrack["uri"];
                // });

                // console.log(trackIdsFormat);
                resolve(slicedTracksArray);
            },
            function(err) {
                console.log("Something went wrong!", err);
                reject(err);
            }
        );
    });
}

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
