const fs = require("fs");

const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const {
  uploadFileToCloudflare,
  deleteFileFromCloudflare,
} = require("../middleware/file-upload");

/**
 * Helper function. DO NOT USE AS RESPONSE HANDLER
 **/
const deleteAllQuestions = async (quizId, sess) => {
  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
  } catch (err) {
    console.log("Something went wrong when accessing the DB");
    throw new HttpError("Something went wrong when accessing the DB", 500);
  }

  if (!quiz) {
    console.log("Invalid quiz ID");
    throw new HttpError("Invalid quiz ID", 404);
  }

  let questions;
  let images = [];

  try {
    questions = await Question.find({ quiz: quizId });
    await Question.deleteMany({ quiz: quizId }, { session: sess });
    for (let qn of questions) {
      if (qn.image) {
        images.push(qn.image);
      }
    }

    return images;
  } catch (err) {
    console.log(`Something went wrong when deleting questions: ${err.message}`);
    throw new HttpError("Something went wrong!", 500);
  }
};

const deleteQuestion = async (req, res, next) => {
  const questionId = req.params.questionId;
  let question;

  try {
    /* 
      populates the "quiz" property with the actual quiz documents (not just ID)
      Only works if the schemas are related with "ref"
    */
    question = await Question.findById(questionId).populate("quiz");
  } catch (err) {
    return next(
      new HttpError("Something went wrong when accessing the DB", 500)
    );
  }

  if (!question) {
    return next(new HttpError("Invalid question ID", 404));
  }

  // TODO: Add authorization similar to below

  // if (note.creator.id !== req.userData.userId) {
  //   return next(
  //     new HttpError("Error: User is not authorized to edit this place!", 401)
  //   );
  // }

  const imagePath = question.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Question.findByIdAndRemove(questionId, { session: sess });

    /* Remove the question from questions list of the quiz */
    question.quiz.questions.pull(question);
    await question.quiz.save({ session: sess });

    /* Remove the image associated with this question */
    if (imagePath) {
      await deleteFileFromCloudflare(imagePath);
      // fs.unlink(imagePath, (err) => {
      //   console.log(err);
      // });
    }

    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Something went wrong!", 500));
  }

  res.json({
    message: "Deleted question successfully!",
    questionId: questionId,
  });
};

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

  let newFileName;

  try {
    if (req.file) {
      newFileName = await uploadFileToCloudflare(req.file);
      const oldFile = question.image;
      if (oldFile) {
        await deleteFileFromCloudflare(oldFile);
      }
      question.image = `uploads/temp/${newFileName}`;
    }
  } catch (err) {
    console.log(err.message);
    return next(
      new HttpError("Unknown error occurred, please try again later", 500)
    );
  }

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

/* Tested */
const createQuestion = async (req, res, next) => {
  const quizId = req.params.quizId;
  const { title, options, solution, score, type } = req.body;
  let quiz;

  /* Check that the quiz exists first*/
  try {
    quiz = await Quiz.findById(quizId);
  } catch (err) {
    const error = new HttpError("Failed to add question! Try again.", 500);
    return next(error);
  }

  if (!quiz) {
    const error = new HttpError("Invalid quiz ID!", 404);
    return next(error);
  }

  let newFileName;

  try {
    if (req.file) {
      newFileName = await uploadFileToCloudflare(req.file);
    }
  } catch (err) {
    console.log(err.message);
    return next(
      new HttpError("Unknown error occurred, please try again later", 500)
    );
  }

  const createdQuestion = new Question({
    title: title,
    options: JSON.parse(options),
    solution: JSON.parse(solution),
    score: score,
    type: type, // TODO: Add validation checks
    image: req.file ? `uploads/temp/${newFileName}` : "",
    quiz: quizId,
  });

  try {
    const session = await mongoose.startSession(); // start session
    session.startTransaction();

    await createdQuestion.save({ session: session }); // remember to specify the session
    quiz.questions.push(createdQuestion); // only the ID is actually pushed
    await quiz.save({ session: session });
    await session.commitTransaction(); // all changes successful, commit them to the DB
  } catch (err) {
    if (newFileName) {
      await deleteFileFromCloudflare(newFileName);
    }
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
exports.deleteQuestion = deleteQuestion;
exports.deleteAllQuestions = deleteAllQuestions;
