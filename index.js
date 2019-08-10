// SERVER SETUP

const express = require("express");
const app = express();
const compression = require("compression");

app.use(compression());

app.use(require("body-parser").json());
const cookieParser = require("cookie-parser");
const csurf = require("csurf");

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

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

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

// const db = require("./utils/db");
// const bc = require("./utils/bc");

// !!!!!ALWAYS BE AT BOTTOM!!!!!
app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
