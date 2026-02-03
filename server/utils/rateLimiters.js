const rateLimit = require("express-rate-limit");

// Heavy API operations rate limits (geocoding, metrics, navigation)
const heavyApiLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 15, // 15 requests per 5 minutes for intensive operations
  message: {
    error: "Demasiadas solicitudes. Intenta de nuevo en 5 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Moderate API operations rate limits (CRUD: create, edit, join, leave)
const moderateApiLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 30, // 30 requests per 5 minutes for CRUD operations
  message: {
    error: "Demasiadas solicitudes. Intenta de nuevo en 5 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Light operations rate limits (read operations, lists, polling)
const lightApiLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 150, // 150 requests per 5 minutes for read operations
  message: {
    error: "Demasiadas solicitudes. Intenta de nuevo en 5 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  heavyApiLimit,
  moderateApiLimit,
  lightApiLimit,
};
