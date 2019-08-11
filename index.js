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

//////////////////////// Authentication Process //////////////////////////

app.get(
    "/",
    passport.authenticate("spotify", {
        scope: [
            "user-read-email",
            "user-read-private",
            "user-follow-read",
            "playlist-modify-private",
            "playlist-modify-public"
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

////////////////// REQUESTS FOR APP ////////////////////////////////////

app.get("/artistName/:artistName.json", async (req, res) => {
    // console.log("My Request Body: ", req.body);
    let artistName = req.params.artistName;

    console.log("Getting Input from Seaching Artist Field!");
    console.log("Artist Name: ", artistName);
    console.log(sptfy.getArtist(artistName));
});

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
