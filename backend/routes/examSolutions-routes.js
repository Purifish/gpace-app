const express = require("express");

const examSolutionsControllers = require("../controllers/examSolutions-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.post(
  "/create/:courseId",
  fileUpload.pdfUpload.single("pdf"),
  examSolutionsControllers.createExamSolution
);

router.patch(
  "/update/:examSolutionId",
  fileUpload.pdfUpload.single("pdf"),
  examSolutionsControllers.updateExamSolution
);

router.delete(
  "/delete/:examSolutionId",
  fileUpload.pdfUpload.any(),
  examSolutionsControllers.deleteExamSolution
);

module.exports = router;
