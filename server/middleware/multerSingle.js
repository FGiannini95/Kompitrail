// Use absolute path so it works locally and in prod
const multer = require("multer");
const path = require("path");

// Upload middleware for a single file field named "file".
function uploadImage(folderName) {
  const storage = multer.diskStorage({
    // Always resolve from this file’s directory
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../public/images/${folderName}`));
    },
    filename: (req, file, cb) => {
      // Avoid collisions
      cb(null, "Id-" + Date.now() + "-" + file.originalname);
    },
  });

  return multer({ storage }).single("file");
}

module.exports = uploadImage;
