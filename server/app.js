require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const usersRouter = require("./routes/users");
const motorbikesRouter = require("./routes/motorbikes");
const routesRouter = require("./routes/route");
const authRouter = require("./routes/auth");
const chatRouter = require("./routes/chat");
const chatBotRouter = require("./routes/chatbot");

var app = express();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static assets from server/public (images, etc.)
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// API routes
app.use("/users", usersRouter);
app.use("/motorbikes", motorbikesRouter);
app.use("/routes", routesRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/chatbot", chatBotRouter);

// Static assets from Vite build (client/dist)
const clientBuildPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientBuildPath));
// SPA fallback: for non-API routes, return index.html
app.get("*", (req, res, next) => {
  // Backend/API prefixes that should NOT be handled by the SPA fallback
  const apiPrefixes = [
    "/users",
    "/motorbikes",
    "/routes",
    "/auth",
    "/chat",
    "/images",
  ];

  // If the request is for one of the backend routes, skip the SPA fallback
  if (apiPrefixes.some((prefix) => req.path.startsWith(prefix))) {
    return next();
  }

  // For any other route, send the React index.html from the Vite build
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
