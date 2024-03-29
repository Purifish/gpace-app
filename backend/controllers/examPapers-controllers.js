const fs = require("fs");

const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Course = require("../models/course");
const ExamPaper = require("../models/examPaper");
const {
  uploadFileToCloudflare,
  deleteFileFromCloudflare,
} = require("../middleware/file-upload");

const deleteExamPaper = async (req, res, next) => {
  const examPaperId = req.params.examPaperId;
  let examPaper;

  try {
    /* 
      populates the "course" property with the actual course documents (not just ID)
      Only works if the schemas are related with "ref"
    */
    examPaper = await ExamPaper.findById(examPaperId).populate("course");
  } catch (err) {
    return next(
      new HttpError("Something went wrong when accessing the DB", 500)
    );
  }

  if (!examPaper) {
    return next(new HttpError("Invalid exam paper ID", 404));
  }

  // TODO: Add authorization similar to below

  // if (note.creator.id !== req.userData.userId) {
  //   return next(
  //     new HttpError("Error: User is not authorized to edit this place!", 401)
  //   );
  // }

  const filePath = examPaper.file;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await ExamPaper.findByIdAndRemove(examPaperId, { session: sess });

    /* Remove the note from notes list of the course */
    examPaper.course.examPapers.pull(examPaper);
    await examPaper.course.save({ session: sess });

    /* Remove the file associated with this note */
    if (filePath) {
      await deleteFileFromCloudflare(filePath);
      // fs.unlink(filePath, (err) => {
      //   console.log(err);
      // });
    }

    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Something went wrong!", 500));
  }

  res.json({
    message: "Deleted exam paper successfully!",
    examPaperId: examPaperId,
  });
};

/*
  TODO: allow file/link remove (and ensure at least one file/link exists)
*/
const updateExamPaper = async (req, res, next) => {
  const { title, link } = req.body;

  let examPaper;
  try {
    examPaper = await ExamPaper.findById(req.params.examPaperId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong! could not update exam paper.", 500)
    );
  }

  if (!examPaper) {
    return next(new HttpError("Invalid exam paper ID", 500));
  }

  if (title) examPaper.title = title;
  if (link) examPaper.link = link;

  let newFileName;

  try {
    if (req.file) {
      const oldFile = examPaper.file;
      if (oldFile) {
        await deleteFileFromCloudflare(oldFile);
      }
      newFileName = await uploadFileToCloudflare(req.file);
      examPaper.file = `uploads/temp/${newFileName}`;
    }
  } catch (err) {
    console.log(err.message);
    return next(
      new HttpError("Unknown error occurred, please try again later", 500)
    );
  }

  try {
    await examPaper.save();
  } catch (err) {
    // TODO: remove uploaded file
    return next(
      new HttpError("Something went wrong, could not update exam paper.", 500)
    );
  }

  res.json({
    examPaper: examPaper.toObject({ getters: true }),
  });
};

/* Tested */
const createExamPaper = async (req, res, next) => {
  const courseId = req.params.courseId;
  const { title, link } = req.body;
  let course;

  /* Check that the course exists first*/
  try {
    course = await Course.findById(courseId);
  } catch (err) {
    const error = new HttpError(
      "Failed to add exam paper! Try again later.",
      500
    );
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Invalid course ID", 404);
    return next(error);
  }

  if (!link && !req.file) {
    return next(new HttpError("Provide a link or a file!", 422));
  }

  let newFileName;

  try {
    if (req.file) {
      newFileName = await uploadFileToCloudflare(req.file);
    }
  } catch (err) {
    return next(new HttpError("Unknown error occurred!!", 500));
  }

  const createdExamPaper = new ExamPaper({
    title: title,
    link: link || "",
    file: req.file ? `uploads/temp/${newFileName}` : "",
    course: courseId,
  });

  try {
    const session = await mongoose.startSession(); // start session
    session.startTransaction();
    console.log("0");

    await createdExamPaper.save({ session: session }); // remember to specify the session
    console.log("1");
    course.examPapers.push(createdExamPaper); // only the ID is actually pushed
    await course.save({ session: session });
    console.log("2");
    await session.commitTransaction(); // all changes successful, commit them to the DB
  } catch (err) {
    if (newFileName) {
      await deleteFileFromCloudflare(newFileName);
    }
    const error = new HttpError("Failed to create exam paper, try again.", 500);
    return next(error);
  }

  res.status(201).json({
    examPaper: createdExamPaper,
  });
};

exports.createExamPaper = createExamPaper;
exports.updateExamPaper = updateExamPaper;
exports.deleteExamPaper = deleteExamPaper;
