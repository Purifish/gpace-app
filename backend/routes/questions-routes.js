const express = require("express");

const questionControllers = require("../controllers/questions-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/:quizId", questionControllers.getQuestionsByQuizId);

router.post(
  "/create/:quizId",
  fileUpload.cloudflareImageUpload.single("image"),
  questionControllers.createQuestion
);

router.patch(
  "/:questionId",
  fileUpload.cloudflareImageUpload.single("image"),
  questionControllers.updateQuestion
);

router.delete(
  "/delete/:questionId",
  fileUpload.imageUpload.any(),
  questionControllers.deleteQuestion
);

module.exports = router;
