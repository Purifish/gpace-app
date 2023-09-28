const express = require("express");

const videoControllers = require("../controllers/videos-controllers");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();

// router.get("/:topic", notesControllers.getQuestionsByTopic);

router.post("/", fileUpload.pdfUpload.any(), videoControllers.createVideo);

// router.patch(
//   "/:qid",
//   fileUpload.single("image"),
//   notesControllers.updateQuestion
// );

module.exports = router;
