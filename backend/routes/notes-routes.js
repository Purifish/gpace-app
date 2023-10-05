const express = require("express");

const notesControllers = require("../controllers/notes-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

// router.get("/:topic", notesControllers.getQuestionsByTopic);

router.post(
  "/create/:courseId",
  fileUpload.pdfUpload.single("pdf"),
  notesControllers.createNote
);

// router.patch(
//   "/:qid",
//   fileUpload.single("image"),
//   notesControllers.updateQuestion
// );

module.exports = router;
