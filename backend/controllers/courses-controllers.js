// const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const Course = require("../models/course");

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

exports.createCourse = createCourse;
exports.getCourses = getCourses;
