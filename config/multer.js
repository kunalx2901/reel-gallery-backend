const multer = require("multer");

const storage = multer.memoryStorage();

const ALLOWED_MIMETYPES = [
  // Video formats
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
  "video/x-matroska",
  "video/x-ms-wmv",
  "video/3gpp",
  "video/3gpp2",
  "video/ogg",
  // Image formats
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "image/avif",
  "image/heic",
  "image/heif",
  // Fallback (some systems send this for any binary file)
  "application/octet-stream",
];

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB max
  fileFilter: (req, file, cb) => {
    console.log("Incoming file:", file.fieldname, "| mimetype:", file.mimetype);
    if (
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("image/") ||
      ALLOWED_MIMETYPES.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`), false);
    }
  },
});

module.exports = upload;