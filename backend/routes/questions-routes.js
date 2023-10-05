const express = require("express");

const questionControllers = require("../controllers/questions-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/:quizId", questionControllers.getQuestionsByQuizId);

router.post(
  "/create/:quizId",
  fileUpload.imageUpload.single("image"),
  questionControllers.createQuestion
);

router.patch(
  "/:questionId",
  fileUpload.imageUpload.single("image"),
  questionControllers.updateQuestion
);

module.exports = router;
