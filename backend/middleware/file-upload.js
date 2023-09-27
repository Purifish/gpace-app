const multer = require("multer");
const uuid = require("uuid");

// CHECKPOINT

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
};

const fileUpload = multer({
  limits: 700000, // 700 kB limit
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // TODO: different path for pdf(notes)
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];

      cb(null, uuid.v1() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
