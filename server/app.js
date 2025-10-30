var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const usersRouter = require("./routes/users");
const motorbikesRouter = require("./routes/motorbikes");
const routesRouter = require("./routes/route");

var app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/motorbikes", motorbikesRouter);
app.use("/routes", routesRouter);

// <-- New pool info
// + db import in the controllers
// + postinstall in the script in package.json
// Serve React build (Vite outputs to client/dist)
/*
const STATIC_DIR = path.resolve(__dirname, "../client/dist");
// 1) Serve static files
app.use(express.static(STATIC_DIR));

// 2) SPA fallback: send index.html for non-API routes
app.get("*", (req, res, next) => {
  if (
    req.path.startsWith("/users") ||
    req.path.startsWith("/motorbikes") ||
    req.path.startsWith("/routes")
  ) {
    return next();
  }
  if (req.accepts("html")) {
    return res.sendFile(path.join(STATIC_DIR, "index.html"));
  }
  return next();
});
// --> New pool info
*/

// Health check
app.get("/health", (_req, res) => res.status(200).send("ok"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
