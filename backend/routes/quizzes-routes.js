const express = require("express");

const quizzesControllers = require("../controllers/quizzes-controllers");

const router = express.Router();

router.get("/", quizzesControllers.getTopics);

router.post("/createquiz", quizzesControllers.createQuiz);

module.exports = router;
