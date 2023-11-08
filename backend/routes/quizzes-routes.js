const express = require("express");

const quizzesControllers = require("../controllers/quizzes-controllers");

const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/:courseId", quizzesControllers.getQuizzesByCourseId);

router.post(
  "/create/:courseId",
  fileUpload.imageUpload.any(),
  quizzesControllers.createQuiz
);

router.patch(
  "/update/:quizId",
  fileUpload.imageUpload.any(),
  quizzesControllers.updateQuiz
);

router.delete(
  "/delete/:quizId",
  fileUpload.imageUpload.any(),
  quizzesControllers.deleteQuiz
);

module.exports = router;
