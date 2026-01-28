const rateLimit = require("express-rate-limit");

// Heavy API operations rate limits
const heavyApiLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 40, // 40 requests per 5 minutes for intensive operations
  message: {
    error: "Demasiadas solicitudes, intenta de nuevo más tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Moderate API operations rate limits
const moderateApiLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 8, // 8 requests per 5 minutes for CRUD operations
  message: {
    error: "Demasiadas solicitudes, intenta de nuevo más tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Light operations rate limits
const lightApiLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  max: 60, // 60 requests per 10 minutes for read operations
  message: {
    error: "Demasiadas solicitudes, intenta de nuevo más tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  heavyApiLimit,
  moderateApiLimit,
  lightApiLimit,
};
