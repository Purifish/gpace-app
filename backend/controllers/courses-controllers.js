const fs = require("fs");

// const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Course = require("../models/course");
const Note = require("../models/note");
const Video = require("../models/video");
const Quiz = require("../models/quiz");
const ExamPaper = require("../models/examPaper");
const ExamSolution = require("../models/examSolution");
const Faq = require("../models/faq");
const { deleteAllQuizzes } = require("../controllers/quizzes-controllers");
const {
  uploadFileToCloudflare,
  deleteFileFromCloudflare,
} = require("../middleware/file-upload");

/* Tested */
const createCourse = async (req, res, next) => {
  const courseTitle = req.body.courseTitle.toLowerCase();
  let existingCourse;

  try {
    existingCourse = await Course.findOne({ courseTitle: courseTitle });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Creating course failed, please try again later", 500)
    );
  }

  if (existingCourse) {
    return next(
      new HttpError("There is already a course with this title", 422)
    );
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

  const newCourse = new Course({
    courseTitle: courseTitle,
    courseCode: req.body.courseCode || "",
    description: req.body.description || "",
    image: req.file ? `uploads/temp/${newFileName}` : "",
    quizzes: [],
    notes: [],
    videos: [],
    examPapers: [],
    examSolutions: [],
  });

  try {
    await newCourse.save();
  } catch (err) {
    const error = new HttpError(
      "Failed to create course, try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({
    message: "Successfully created new course",
    courseId: newCourse.id,
  });
};

const deleteCourse = async (req, res, next) => {
  const courseId = req.params.courseId;
  let course;

  try {
    course = await Course.findById(courseId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong when accessing the DB", 500)
    );
  }

  if (!course) {
    return next(new HttpError("Invalid course ID", 404));
  }

  // TODO: Add authorization similar to below

  // if (note.creator.id !== req.userData.userId) {
  //   return next(
  //     new HttpError("Error: User is not authorized to edit this place!", 401)
  //   );
  // }

  let quizzes;
  let quizImages;
  const images = [];

  try {
    quizzes = await Quiz.find({ course: course._id });
    const sess = await mongoose.startSession();
    sess.startTransaction();
    /* Delete all quizzes of this course */
    quizImages = await deleteAllQuizzes(courseId, sess);
    images.push(...quizImages);
    console.log("4");
    /* Delete all notes of this course */
    await Note.deleteMany({ course: courseId }, { session: sess });

    /* Delete all FAQs of this course */
    await Faq.deleteMany({ course: courseId }, { session: sess });

    /* Delete all videos of this course */
    await Video.deleteMany({ course: courseId }, { session: sess });

    /* Delete all exam papers of this course */
    await ExamPaper.deleteMany({ course: courseId }, { session: sess });

    /* Delete all exam solutions of this course */
    await ExamSolution.deleteMany({ course: courseId }, { session: sess });

    /* Finally, delete the course */
    await Course.findByIdAndRemove(courseId, { session: sess });

    if (course.image) {
      images.push(course.image);
    }

    for (let filePath of images) {
      fs.unlink(filePath, (err) => {
        console.log(`Error removing file: ${err}`);
      });
    }

    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Something went wrong!", 500));
  }

  res.json({
    message: "Deleted Course successfully!",
    course: course,
  });
};

const updateCourse = async (req, res, next) => {
  const { courseCode, courseTitle, description } = req.body;

  let course;
  try {
    course = await Course.findById(req.params.courseId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong! could not update course.", 500)
    );
  }

  if (!course) {
    return next(new HttpError("Invalid course ID", 500));
  }

  if (courseCode) course.courseCode = courseCode;
  if (description) course.description = description;
  if (courseTitle) course.courseTitle = courseTitle.toLowerCase();

  try {
    let oldFile;
    if (req.file) {
      oldFile = course.image;
      let newFileName = await uploadFileToCloudflare(req.file);
      course.image = `uploads/temp/${newFileName}`;
      await deleteFileFromCloudflare(oldFile);
    }

    await course.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update course.", 500)
    );
  }

  // if (oldFile) {
  //   fs.unlink(oldFile, (err) => {
  //     console.log(err);
  //   });
  // }

  res.json({
    course: course.toObject({ getters: true }),
  });
};

/* Tested */
const getCourses = async (req, res, next) => {
  let courses;
  try {
    courses = await Course.find({});
  } catch (err) {
    return next(new HttpError("Error fetching courses, try again later", 500));
  }

  res.json({
    courses: courses.map((course) => course.toObject({ getters: true })),
  });
};

/* Tested */
const getResourcesByCourseId = async (req, res, next) => {
  const courseId = req.params.courseId;
  const courseTitle = decodeURI(req.params.courseTitle);

  /* Check that the course exists first*/
  let course;
  try {
    if (courseId) {
      course = await Course.findById(courseId);
    } else {
      course = await Course.findOne({ courseTitle: courseTitle });
    }
  } catch (err) {
    const error = new HttpError("Failed to access database! Try again.", 500);
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Invalid course ID or title", 404);
    return next(error);
  }

  let notes, videos, quizzes, examPapers, examSolutions, faqs;
  try {
    notes = await Note.find({ course: course._id });
    videos = await Video.find({ course: course._id });
    quizzes = await Quiz.find({ course: course._id });
    examPapers = await ExamPaper.find({ course: course._id });
    examSolutions = await ExamSolution.find({ course: course._id });
    faqs = await Faq.find({ course: course._id });
  } catch (err) {
    return next(new HttpError("Error retrieving data from the DB", 500));
  }

  res.json({
    notes: notes.map((note) => {
      return note.toObject({ getters: true });
    }),
    videos: videos.map((video) => {
      return video.toObject({ getters: true });
    }),
    quizzes: quizzes.map((quiz) => {
      return quiz.toObject({ getters: true });
    }),
    examPapers: examPapers.map((examPaper) => {
      return examPaper.toObject({ getters: true });
    }),
    examSolutions: examSolutions.map((examSolution) => {
      return examSolution.toObject({ getters: true });
    }),
    faqs: faqs.map((faq) => {
      return faq.toObject({ getters: true });
    }),
    tutors: [],
  });
};

exports.createCourse = createCourse;
exports.getCourses = getCourses;
exports.getResourcesByCourseId = getResourcesByCourseId;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;
