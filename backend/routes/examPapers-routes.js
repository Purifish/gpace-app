const express = require("express");

const examPapersControllers = require("../controllers/examPapers-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

// router.get("/:topic", notesControllers.getQuestionsByTopic);

router.post(
  "/create/:courseId",
  fileUpload.pdfUpload.single("pdf"),
  examPapersControllers.createExamPaper
);

router.patch(
  "/update/:examPaperId",
  fileUpload.pdfUpload.single("pdf"),
  examPapersControllers.updateExamPaper
);

router.delete(
  "/delete/:examPaperId",
  fileUpload.pdfUpload.any(),
  examPapersControllers.deleteExamPaper
);

module.exports = router;
