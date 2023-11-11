const express = require("express");

const notesControllers = require("../controllers/notes-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

// router.get("/:topic", notesControllers.getQuestionsByTopic);

router.post(
  "/create/:courseId",
  fileUpload.cloudflarePdfUpload.single("pdf"),
  notesControllers.createNote
);

router.patch(
  "/update/:noteId",
  fileUpload.cloudflarePdfUpload.single("pdf"),
  notesControllers.updateNote
);

router.delete(
  "/delete/:noteId",
  fileUpload.pdfUpload.any(),
  notesControllers.deleteNote
);

module.exports = router;
