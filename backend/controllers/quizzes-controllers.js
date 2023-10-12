// const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Quiz = require("../models/quiz");
const Course = require("../models/course");

/* Done */
const getQuizzesByCourseId = async (req, res, next) => {
  const courseId = req.params.courseId;
  let quizzes;
  try {
    quizzes = await Quiz.find({ course: courseId });
  } catch (err) {
    return next(new HttpError("Error fetching quizzes, try again later", 500));
  }

  res.json({
    quizzes: quizzes.map((quiz) => quiz.toObject({ getters: true })),
  });
};

/* Done */
const createQuiz = async (req, res, next) => {
  const courseId = req.params.courseId;
  const title = req.body.title.toLowerCase();
  let existingTitle;
  let course;

  try {
    course = await Course.findById(courseId);
    existingTitle = await Quiz.findOne({ title: title, course: courseId });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Creating quiz failed, please try again later", 500)
    );
  }

  if (!course) {
    return next(new HttpError("Invalid course ID!", 404));
  }

  if (existingTitle) {
    return next(new HttpError("There is already a quiz with this title", 422));
  }

  const newQuiz = new Quiz({
    title: title,
    course: courseId,
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
exports.getQuizzesByCourseId = getQuizzesByCourseId;
