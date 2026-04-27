const multer = require("multer");
const path = require("path");
// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
// Generate a unique filename for the uploaded file
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
    );
  },
});
// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};
// Create the multer instance with the defined storage and file filter
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;