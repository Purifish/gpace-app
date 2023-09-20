// const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const Quiz = require("../models/quiz");

const getTopics = async (req, res, next) => {
  let topics;
  try {
    topics = await Quiz.find({}, "-questions");
  } catch (err) {
    return next(new HttpError("Error fetching topics, try again later", 500));
  }

  res.json({
    topics: topics.map((topic) => topic.toObject({ getters: true })),
  });
};

const createQuiz = async (req, res, next) => {
  const topic = req.body.topic.toLowerCase();

  let existingTopic;

  try {
    existingTopic = await Quiz.findOne({ topic: topic });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Creating quiz failed, please try again later", 500)
    );
  }

  if (existingTopic) {
    return next(new HttpError("There is already a quiz with this topic", 422));
  }

  const newQuiz = new Quiz({
    topic: topic,
    questions: [],
  });

  try {
    await newQuiz.save();
  } catch (err) {
    const error = new HttpError("Failed to create quiz, try again later", 500);
    return next(error);
  }

  res.status(201).json({
    message: "Successfully created new quiz",
    quizId: newQuiz.id,
  });
};

exports.createQuiz = createQuiz;
exports.getTopics = getTopics;
