// const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const Course = require("../models/course");
const Note = require("../models/note");
const Video = require("../models/video");
const Quiz = require("../models/quiz");

/* Done */
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

/* Done */
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

  const newCourse = new Course({
    courseTitle: courseTitle,
    courseCode: req.body.courseCode || "",
    description: req.body.description || "",
    image: req.file ? req.file.path : "",
    quizzes: [],
    notes: [],
    videos: [],
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

/* Done */
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
    // quiz = await Quiz.findOne({ topic: topic });
  } catch (err) {
    const error = new HttpError("Failed to access database! Try again.", 500);
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Invalid course ID or title", 404);
    return next(error);
  }

  // let quizQuestions;
  let notes, videos, quizzes;
  try {
    notes = await Note.find({ course: course._id });
    videos = await Video.find({ course: course._id });
    quizzes = await Quiz.find({ course: course._id });
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
    tutors: [],
  });
};

exports.createCourse = createCourse;
exports.getCourses = getCourses;
exports.getResourcesByCourseId = getResourcesByCourseId;
