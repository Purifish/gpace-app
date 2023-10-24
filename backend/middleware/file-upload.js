const multer = require("multer");
const uuid = require("uuid");

const IMAGE_MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const PDF_MIME_TYPE_MAP = {
  "application/pdf": "pdf",
};

const imageUpload = multer({
  limits: 700000, // 700 kB limit
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = IMAGE_MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid.v1() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!IMAGE_MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

const pdfUpload = multer({
  limits: 5000000, // 5 MB limit
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/pdf");
    },
    filename: (req, file, cb) => {
      cb(null, uuid.v1() + ".pdf");
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!PDF_MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

exports.imageUpload = imageUpload;
exports.pdfUpload = pdfUpload;
