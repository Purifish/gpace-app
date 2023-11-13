const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const Course = require("../models/course");
const { deleteAllQuestions } = require("../controllers/questions-controllers");

/**
 * Helper function. DO NOT USE AS RESPONSE HANDLER
 **/
const deleteAllQuizzes = async (courseId, sess) => {
  let course;

  try {
    course = await Course.findById(courseId);
  } catch (err) {
    throw new HttpError("Something went wrong when accessing the DB", 500);
  }

  if (!course) {
    throw new HttpError("Invalid course ID", 404);
  }

  let quizzes;
  let images = [];

  try {
    quizzes = await Quiz.find({ course: courseId });

    // Delete all questions for each quiz
    for (let quiz of quizzes) {
      let quizImages = await deleteAllQuestions(quiz._id, sess);
      images.push(...quizImages);
    }

    // Then delete all the quizzes
    await Quiz.deleteMany({ course: courseId }, { session: sess });
    return images;
  } catch (err) {
    console.log("Something went wrong when deleting questions x!");
    throw new HttpError("Something went wrong!", 500);
  }
};

const deleteQuiz = async (req, res, next) => {
  const quizId = req.params.quizId;
  let quiz;

  try {
    /* 
      populates the "course" property with the actual course documents (not just ID)
      Only works if the schemas are related with "ref"
    */
    quiz = await Quiz.findById(quizId).populate("course");
  } catch (err) {
    return next(
      new HttpError("Something went wrong when accessing the DB", 500)
    );
  }

  if (!quiz) {
    return next(new HttpError("Invalid quiz ID", 404));
  }

  // TODO: Add authorization similar to below

  // if (note.creator.id !== req.userData.userId) {
  //   return next(
  //     new HttpError("Error: User is not authorized to edit this place!", 401)
  //   );
  // }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Question.deleteMany({ quiz: quizId }, { session: sess });
    await Quiz.findByIdAndRemove(quizId, { session: sess });

    /* Remove the note from notes list of the course */
    quiz.course.quizzes.pull(quiz);
    await quiz.course.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Something went wrong!", 500));
  }

  res.json({
    message: "Deleted Quiz successfully!",
    quizId: quizId,
  });
};

const updateQuiz = async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return next(new HttpError("Title cannot be empty!", 500));
  }

  let quiz;
  try {
    quiz = await Quiz.findById(req.params.quizId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong! could not update quiz.", 500)
    );
  }

  if (!quiz) {
    return next(new HttpError("Invalid quiz ID", 500));
  }

  quiz.title = title;

  try {
    await quiz.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update quiz.", 500)
    );
  }

  res.json({
    quiz: quiz.toObject({ getters: true }),
  });
};

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

/* Tested */
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
    const session = await mongoose.startSession(); // start session
    session.startTransaction();

    await newQuiz.save({ session: session }); // remember to specify the session
    course.quizzes.push(newQuiz); // only the ID is actually pushed
    await course.save({ session: session });
    await session.commitTransaction(); // all changes successful, commit them to the DB
  } catch (err) {
    const error = new HttpError(
      "Failed to create quiz, try again later xd",
      500
    );
    return next(error);
  }

  res.status(201).json({
    message: "Successfully created new quiz",
    quizId: newQuiz.id,
  });
};

exports.createQuiz = createQuiz;
exports.getQuizzesByCourseId = getQuizzesByCourseId;
exports.updateQuiz = updateQuiz;
exports.deleteQuiz = deleteQuiz;
exports.deleteAllQuizzes = deleteAllQuizzes;
