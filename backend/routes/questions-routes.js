const express = require("express");

const questionControllers = require("../controllers/questions-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/:topic", questionControllers.getQuestionsByTopic);

router.post(
  "/",
  fileUpload.imageUpload.single("image"),
  questionControllers.createQuestion
);

router.patch(
  "/:qid",
  fileUpload.imageUpload.single("image"),
  questionControllers.updateQuestion
);

module.exports = router;
