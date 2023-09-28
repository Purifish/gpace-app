const express = require("express");
// const { check } = require("express-validator");

const quizzesControllers = require("../controllers/quizzes-controllers");

const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", quizzesControllers.getTopics);

router.post(
  "/createquiz",
  fileUpload.imageUpload.single("image"),
  quizzesControllers.createQuiz
);

// router.post(
//   "/uploadtest",
//   fileUpload.single("image"),
//   async (req, res, next) => {
//     console.log(req.file.path);
//     res.status(201).json({
//       message: "OK",
//       image: req.file.path,
//     });
//   }
// );

module.exports = router;
