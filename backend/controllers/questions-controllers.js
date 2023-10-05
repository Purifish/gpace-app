const HttpError = require("../models/http-error");
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const mongoose = require("mongoose");

/* Done */
const updateQuestion = async (req, res, next) => {
  const { title, options, solution, score, type } = req.body;

  let question;
  try {
    question = await Question.findById(req.params.questionId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong! could not update question.", 500)
    );
  }

  if (!question) {
    return next(new HttpError("Invalid question ID", 500));
  }

  if (title) question.title = title;
  if (options) question.options = JSON.parse(options);
  if (solution) question.solution = JSON.parse(solution);
  if (score) question.score = score;
  if (type) question.type = type;
  if (req.file) question.image = req.file.path;

  try {
    await question.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update question.", 500)
    );
  }

  res.json({
    question: question.toObject({ getters: true }),
  });
};

/* Done */
const createQuestion = async (req, res, next) => {
  const quizId = req.params.quizId;
  const { title, options, solution, score, type } = req.body;
  let quiz;

  /* Check that the quiz exists first*/
  try {
    quiz = await Quiz.findById(quizId);
    // console.log(req.file);
    // console.log(req.file.path);
  } catch (err) {
    const error = new HttpError("Failed to add question! Try again.", 500);
    return next(error);
  }

  if (!quiz) {
    const error = new HttpError("Invalid quiz ID!", 404);
    return next(error);
  }

  const createdQuestion = new Question({
    title: title,
    options: JSON.parse(options),
    solution: JSON.parse(solution),
    score: score,
    type: type, // TODO: Add validation checks
    image: req.file ? req.file.path : "",
    quiz: quizId,
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

/* Done */
const getQuestionsByQuizId = async (req, res, next) => {
  const quizId = req.params.quizId;
  // const topic = decodeURI(req.params.topic);

  /* Check that the quiz exists first*/
  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
  } catch (err) {
    const error = new HttpError("Failed to access questions! Try again.", 500);
    return next(error);
  }

  if (!quiz) {
    const error = new HttpError("Invalid quiz ID!", 404);
    return next(error);
  }

  let quizQuestions;
  try {
    quizQuestions = await Question.find({ quiz: quiz._id });
  } catch (err) {
    return next(new HttpError("Error retrieving questions from the DB", 500));
  }

  if (quizQuestions.length === 0) {
    res.json({
      questions: [],
    });
    return;
  }
  res.json({
    questions: quizQuestions.map((question) =>
      question.toObject({ getters: true })
    ),
  });
};

exports.createQuestion = createQuestion;
exports.getQuestionsByQuizId = getQuestionsByQuizId;
exports.updateQuestion = updateQuestion;
