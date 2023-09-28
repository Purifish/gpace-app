// const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const Course = require("../models/course");
const Note = require("../models/note");
const Video = require("../models/video");
// const Note = require("../models/note");

const getCourses = async (req, res, next) => {
  let courses;
  try {
    courses = await Course.find({}, "-quizQuestions");
  } catch (err) {
    return next(new HttpError("Error fetching courses, try again later", 500));
  }

  res.json({
    courses: courses.map((course) => course.toObject({ getters: true })),
  });
};

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
    image: req.file ? req.file.path : "",
    quizQuestions: [],
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

const getResourcesByCourseId = async (req, res, next) => {
  const courseId = req.params.courseId;

  /* Check that the course exists first*/
  let course;
  try {
    course = await Course.findById(courseId);
  } catch (err) {
    const error = new HttpError("Failed to access database! Try again.", 500);
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Invalid course ID", 404);
    return next(error);
  }

  // let quizQuestions;
  let notes, videos;
  try {
    // quizQuestions = await Question.find({ topic: quiz._id });
    notes = await Note.find({ course: courseId });
    videos = await Video.find({ course: courseId });
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
    tutors: [],
  });
};

exports.createCourse = createCourse;
exports.getCourses = getCourses;
exports.getResourcesByCourseId = getResourcesByCourseId;
