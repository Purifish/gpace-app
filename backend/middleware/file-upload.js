const multer = require("multer");
const uuid = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const IMAGE_MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const PDF_MIME_TYPE_MAP = {
  "application/pdf": "pdf",
};

/**
 * Uploads a file to Cloudflare
 * @returns The name of the file uploaded
 */
const uploadFileToCloudflare = async (file) => {
  try {
    if (
      !process.env.R2_ACCESS_KEY_ID ||
      !process.env.R2_SECRET_ACCESS_KEY ||
      !process.env.ENDPOINT ||
      !process.env.BUCKET_NAME
    ) {
      throw new HttpError("Missing env vars, contact admin!", 404);
    }
    const S3 = new S3Client({
      region: "auto",
      endpoint: process.env.ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    let newFileName = `${uuid.v1()}-${file.originalname}`;
    await S3.send(
      new PutObjectCommand({
        Body: file.buffer,
        Bucket: process.env.BUCKET_NAME,
        Key: newFileName,
        ContentType: file.mimetype,
      })
    );

    return newFileName;
  } catch (err) {
    throw err;
  }
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

const cloudflarePdfUpload = multer({
  limits: 5000000, // 5 MB limit
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const isValid = !!PDF_MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

const cloudflareImageUpload = multer({
  limits: 700000, // 5 MB limit
  storage: multer.memoryStorage(),
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
exports.cloudflarePdfUpload = cloudflarePdfUpload;
exports.cloudflareImageUpload = cloudflareImageUpload;
exports.uploadFileToCloudflare = uploadFileToCloudflare;
