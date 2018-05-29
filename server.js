const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const logDevice = require("./logger");

const JWT_SECRET = "scope-examples-secret";
const USER_TOKEN_NAME = "token";

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const PORT = process.env.PORT || 3000;

app.use(cookieParser());

const requireUser = expressJwt({
  secret: JWT_SECRET,
  getToken: req => req.cookies[USER_TOKEN_NAME]
});

const setUser = (res, payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  res.cookie(USER_TOKEN_NAME, token, {
    maxAge: 3600000 // 1 hour in ms
  });
};

// simple middleware to verify that a recent check has passed
// we could verify the check time, but for now if the jwt is still valid, we're happy
const requireDeviceHealth = (req, res, next) => {
  if (req.user && req.user.deviceStatus && req.user.deviceStatus.pass) {
    next();
  } else {
    if (!req.user) return next(createError(401));
    console.log("device check didn't pass, redirecting");
    next(createError(403, "Device is not secure", { runStethoscope: true }));
  }
};

app.get("/", (req, res) => res.redirect("/banner"));

app.post("/login", urlencodedParser, (req, res) => {
  // we aren't actually authenticating, just trust the form value
  setUser(res, { sub: req.body.email });
  res.redirect(req.query.next || "/");
});

app.get("/logout", (req, res) => {
  res.clearCookie(USER_TOKEN_NAME);
  res.redirect("/");
});

// must be logged in to report
app.post("/report", requireUser, jsonParser, (req, res) => {
  const result = req.body.policy.validate.status;
  setUser(
    res,
    Object.assign(
      { sub: req.user.sub },
      { deviceStatus: { pass: result === "PASS" } }
    )
  );
  const deviceInfo = { user: req.user.sub, device: req.body };
  // you could write this to a database
  logDevice(deviceInfo);
  res.sendStatus(200);
});

// requires a user token
app.get("/reporting", requireUser);

// requires a user token and a recent passing report
app.get("/blocking", requireUser, requireDeviceHealth);

// serve static assets
// adding this last lets us run our auth and device check middleware first
app.use(express.static("public", { extensions: ["html"] }));

// add custom handlers for 401 and 403 errors
app.use((err, req, res, next) => {
  if (err) {
    console.log("error", err);
    if (err.status === 401)
      return res.redirect(`/login?next=${encodeURIComponent(req.path)}`);
    // this is a special case for errors requiring a stethoscope scan
    if (err.runStethoscope)
      return res.sendFile("public/fix.html", { root: __dirname });
    res.sendStatus(err.status || 500);
  } else {
    next();
  }
});

app.listen(PORT, () =>
  console.log(`Stethoscope example app running at http://localhost:${PORT}`)
);
