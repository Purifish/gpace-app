const HttpError = require("../models/http-error");
const Course = require("../models/course");
const Note = require("../models/note");
const mongoose = require("mongoose");
const fs = require("fs");

const deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId;
  let note;

  try {
    /* 
      populates the "course" property with the actual course documents (not just ID)
      Only works if the schemas are related with "ref"
    */
    note = await Note.findById(noteId).populate("course");
  } catch (err) {
    return next(
      new HttpError("Something went wrong when accessing the DB", 500)
    );
  }

  if (!note) {
    return next(new HttpError("Invalid note ID", 404));
  }

  // TODO: Add authorization similar to below

  // if (note.creator.id !== req.userData.userId) {
  //   return next(
  //     new HttpError("Error: User is not authorized to edit this place!", 401)
  //   );
  // }

  const filePath = note.file;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Note.findByIdAndRemove(noteId, { session: sess });

    /* Remove the note from notes list of the course */
    note.course.notes.pull(note);
    await note.course.save({ session: sess });

    /* Remove the file associated with this note */
    if (filePath) {
      fs.unlink(filePath, (err) => {
        console.log(err);
      });
    }

    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Something went wrong!", 500));
  }

  res.json({
    message: "Deleted note successfully!",
    noteId: noteId,
  });
};

/*
  TODO: allow file/link remove (and ensure at least one file/link exists)
*/
const updateNote = async (req, res, next) => {
  const { title, description, link } = req.body;

  let note;
  try {
    note = await Note.findById(req.params.noteId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong! could not update note.", 500)
    );
  }

  if (!note) {
    return next(new HttpError("Invalid note ID", 500));
  }

  if (title) note.title = title;
  if (description) note.description = description;
  if (link) note.link = link;

  let oldFile;
  if (req.file && req.file.path) {
    oldFile = note.file;
    note.file = file;
  }

  try {
    await note.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update note.", 500)
    );
  }

  if (oldFile) {
    fs.unlink(oldFile, (err) => {
      console.log(err);
    });
  }

  res.json({
    note: note.toObject({ getters: true }),
  });
};

const createNote = async (req, res, next) => {
  const courseId = req.params.courseId;
  const { title, description, link } = req.body;
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
    link: link || "",
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
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;
