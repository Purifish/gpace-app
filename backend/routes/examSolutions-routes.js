const express = require("express");

const examSolutionsControllers = require("../controllers/examSolutions-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.post(
  "/create/:courseId",
  fileUpload.cloudflarePdfUpload.single("pdf"),
  examSolutionsControllers.createExamSolution
);

router.patch(
  "/update/:examSolutionId",
  fileUpload.cloudflarePdfUpload.single("pdf"),
  examSolutionsControllers.updateExamSolution
);

router.delete(
  "/delete/:examSolutionId",
  fileUpload.pdfUpload.any(),
  examSolutionsControllers.deleteExamSolution
);

// router.get("/testing", fileUpload.pdfUpload.any(), (req, res, next) => {
//   let filePath =
//     "uploads/temp/a3c7c630-807d-11ee-97f0-6353f1389d59-Kurzgesagt-HD-Wallpaper-1.png";
//   filePath = filePath.split("/").at(-1);
//   console.log(filePath);
//   res.json({
//     file: filePath,
//   });
// });

module.exports = router;
