const HttpError = require("../models/http-error");
const Course = require("../models/course");
const Note = require("../models/note");
const mongoose = require("mongoose");

// const updateNote = async (req, res, next) => {
//   const { title, options, solution, score, type } = req.body;

//   let question;
//   try {
//     question = await Note.findById(req.params.qid);
//   } catch (err) {
//     return next(
//       new HttpError("Something went wrong! could not update question.", 500)
//     );
//   }

//   if (!question) {
//     return next(new HttpError("Invalid question ID", 500));
//   }

//   if (title) question.title = title;
//   if (options) question.options = JSON.parse(options);
//   if (solution) question.solution = JSON.parse(solution);
//   if (score) question.score = score;
//   if (type) question.type = type;

//   try {
//     await question.save();
//   } catch (err) {
//     return next(
//       new HttpError("Something went wrong, could not update question.", 500)
//     );
//   }

//   res.json({
//     question: question.toObject({ getters: true }),
//   });
// };

const createNote = async (req, res, next) => {
  const { courseId, title, description, link } = req.body;
  let course;

  /* Check that the course exists first*/
  try {
    course = await Course.findById(courseId);
  } catch (err) {
    const error = new HttpError("Failed to add note! Try again.", 500);
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Invalid topic", 404);
    return next(error);
  }

  if (!link && (!req.file || !req.file.path)) {
    return next(new HttpError("Provide a link or a file!", 422));
  }

  const createdNote = new Note({
    title: title,
    description: description,
    link: link,
    file: req.file ? req.file.path : "",
    course: courseId,
  });

  try {
    const session = await mongoose.startSession(); // start session
    session.startTransaction();
    console.log("0");

    await createdNote.save({ session: session }); // remember to specify the session
    console.log("1");
    course.notes.push(createdNote); // only the ID is actually pushed
    await course.save({ session: session });
    console.log("2");
    await session.commitTransaction(); // all changes successful, commit them to the DB
  } catch (err) {
    const error = new HttpError("Failed to create note, try again.", 500);
    return next(error);
  }

  res.status(201).json({
    note: createdNote,
  });
};

// const getNotesByCourse = async (req, res, next) => {
//   const topic = req.params.topic;

//   /* Check that the quiz exists first*/
//   let quiz;
//   try {
//     quiz = await Course.findOne({ topic: topic });
//   } catch (err) {
//     const error = new HttpError("Failed to access questions! Try again.", 500);
//     return next(error);
//   }

//   if (!quiz) {
//     const error = new HttpError("Invalid topic", 404);
//     return next(error);
//   }

//   let quizQuestions;
//   try {
//     quizQuestions = await Note.find({ topic: quiz._id });
//   } catch (err) {
//     return next(new HttpError("Error retrieving questions from the DB", 500));
//   }

//   if (quizQuestions.length === 0) {
//     // next(new HttpError("This quiz has no questions!", 404));
//     res.json({
//       questions: [],
//     });
//     return;
//   }
//   res.json({
//     questions: quizQuestions.map((question) =>
//       question.toObject({ getters: true })
//     ),
//   });
// };

exports.createNote = createNote;
// exports.getNotesByCourse = getNotesByCourse;
// exports.updateNote = updateNote;
