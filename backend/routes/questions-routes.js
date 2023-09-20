const express = require("express");

const questionControllers = require("../controllers/questions-controllers");

const router = express.Router();

router.get("/:topic", questionControllers.getQuestionsByTopic);

router.post("/", questionControllers.createQuestion);

module.exports = router;
