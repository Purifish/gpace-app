const fs = require("fs");

const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Course = require("../models/course");
const ExamSolution = require("../models/examSolution");
const {
  uploadFileToCloudflare,
  deleteFileFromCloudflare,
} = require("../middleware/file-upload");

const deleteExamSolution = async (req, res, next) => {
  const examSolutionId = req.params.examSolutionId;
  let examSolution;

  try {
    /* 
      populates the "course" property with the actual course documents (not just ID)
      Only works if the schemas are related with "ref"
    */
    examSolution = await ExamSolution.findById(examSolutionId).populate(
      "course"
    );
  } catch (err) {
    return next(
      new HttpError("Something went wrong when accessing the DB", 500)
    );
  }

  if (!examSolution) {
    return next(new HttpError("Invalid exam solution ID", 404));
  }

  // TODO: Add authorization similar to below

  // if (note.creator.id !== req.userData.userId) {
  //   return next(
  //     new HttpError("Error: User is not authorized to edit this place!", 401)
  //   );
  // }

  let filePath = examSolution.file;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await ExamSolution.findByIdAndRemove(examSolutionId, { session: sess });

    /* Remove the note from notes list of the course */
    examSolution.course.examSolutions.pull(examSolution);
    await examSolution.course.save({ session: sess });

    /* Remove the file associated with this note */
    if (filePath) {
      const fileName = filePath.split("/").at(-1);
      deleteFileFromCloudflare(fileName);
      // fs.unlink(filePath, (err) => {
      //   console.log(err);
      // });
    }

    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Something went wrong!", 500));
  }

  res.json({
    message: "Deleted exam solution successfully!",
    examSolutionId: examSolutionId,
  });
};

/*
  TODO: allow file/link remove (and ensure at least one file/link exists)
*/
const updateExamSolution = async (req, res, next) => {
  const { title, link } = req.body;

  let examSolution;
  try {
    examSolution = await ExamSolution.findById(req.params.examSolutionId);
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong! could not update exam solution.",
        500
      )
    );
  }

  if (!examSolution) {
    return next(new HttpError("Invalid exam solution ID", 500));
  }

  if (title) examSolution.title = title;
  if (link) examSolution.link = link;

  let newFileName;

  try {
    if (req.file) {
      newFileName = await uploadFileToCloudflare(req.file);
      examSolution.file = `uploads/temp/${newFileName}`;
    }
  } catch (err) {
    console.log(err.message);
    return next(
      new HttpError("Unknown error occurred, please try again later", 500)
    );
  }

  try {
    await examSolution.save();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong, could not update exam solution.",
        500
      )
    );
  }

  res.json({
    examSolution: examSolution.toObject({ getters: true }),
  });
};

/* Tested */
const createExamSolution = async (req, res, next) => {
  const courseId = req.params.courseId;
  const { title, link } = req.body;
  let course;

  /* Check that the course exists first*/
  try {
    course = await Course.findById(courseId);
  } catch (err) {
    const error = new HttpError(
      "Failed to add exam solution! Try again later.",
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
    console.log(err.message);
    return next(
      new HttpError("Unknown error occurred, please try again later", 500)
    );
  }

  const createdExamSolution = new ExamSolution({
    title: title,
    link: link || "",
    file: req.file ? `uploads/temp/${newFileName}` : "",
    course: courseId,
  });

  try {
    const session = await mongoose.startSession(); // start session
    session.startTransaction();
    console.log("0");

    await createdExamSolution.save({ session: session }); // remember to specify the session
    console.log("1");
    course.examSolutions.push(createdExamSolution); // only the ID is actually pushed
    await course.save({ session: session });
    console.log("2");
    await session.commitTransaction(); // all changes successful, commit them to the DB
  } catch (err) {
    if (newFileName) {
      await deleteFileFromCloudflare(newFileName);
    }
    const error = new HttpError(
      "Failed to create exam solution, try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    examSolution: createdExamSolution,
  });
};

exports.createExamSolution = createExamSolution;
exports.updateExamSolution = updateExamSolution;
exports.deleteExamSolution = deleteExamSolution;
