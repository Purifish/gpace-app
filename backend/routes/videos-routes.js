const express = require("express");

const videoControllers = require("../controllers/videos-controllers");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();

router.post(
  "/create/:courseId",
  fileUpload.pdfUpload.any(),
  videoControllers.createVideo
);

router.patch(
  "/update/:videoId",
  fileUpload.pdfUpload.any(),
  videoControllers.updateVideo
);

router.delete(
  "/delete/:videoId",
  fileUpload.pdfUpload.any(),
  videoControllers.deleteVideo
);

module.exports = router;
