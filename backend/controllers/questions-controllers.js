const HttpError = require("../models/http-error");
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const mongoose = require("mongoose");

const createQuestion = async (req, res, next) => {
  const { topic, title, options, solution, score, type } = req.body;
  let quiz;

  /* Check that the quiz exists first*/
  try {
    quiz = await Quiz.findOne({ topic: topic });
  } catch (err) {
    const error = new HttpError("Failed to add question! Try again.", 500);
    return next(error);
  }

  if (!quiz) {
    const error = new HttpError("Invalid topic", 404);
    return next(error);
  }

  const createdQuestion = new Question({
    title: title,
    options: JSON.parse(options),
    solution: JSON.parse(solution),
    score: score,
    type: type,
    image: req.file ? req.file.path : "",
    topic: quiz._id,
  });

  try {
    const session = await mongoose.startSession(); // start session
    session.startTransaction();
    console.log("0");

    await createdQuestion.save({ session: session }); // remember to specify the session
    console.log("1");
    quiz.questions.push(createdQuestion); // only the ID is actually pushed
    await quiz.save({ session: session });
    console.log("2");
    await session.commitTransaction(); // all changes successful, commit them to the DB
  } catch (err) {
    const error = new HttpError("Failed to create question, try again.", 500);
    return next(error);
  }

  res.status(201).json({
    question: createdQuestion,
  });
};

const getQuestionsByTopic = async (req, res, next) => {
  const topic = req.params.topic;

  /* Check that the quiz exists first*/
  let quiz;
  try {
    quiz = await Quiz.findOne({ topic: topic });
  } catch (err) {
    const error = new HttpError("Failed to access questions! Try again.", 500);
    return next(error);
  }

  if (!quiz) {
    const error = new HttpError("Invalid topic", 404);
    return next(error);
  }

  let quizQuestions;
  try {
    quizQuestions = await Question.find({ topic: quiz._id });
  } catch (err) {
    return next(new HttpError("Error retrieving questions from the DB", 500));
  }

  if (quizQuestions.length === 0) {
    next(new HttpError("This quiz has no questions!", 404));
    return;
  }
  res.json({
    questions: quizQuestions.map((question) =>
      question.toObject({ getters: true })
    ),
  });
};

exports.createQuestion = createQuestion;
exports.getQuestionsByTopic = getQuestionsByTopic;
