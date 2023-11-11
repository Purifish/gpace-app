const fs = require("fs");

// const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const uuid = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const HttpError = require("../models/http-error");
const Course = require("../models/course");
const Note = require("../models/note");
const Video = require("../models/video");
const Quiz = require("../models/quiz");
const ExamPaper = require("../models/examPaper");
const ExamSolution = require("../models/examSolution");
const Faq = require("../models/faq");
const { deleteAllQuizzes } = require("../controllers/quizzes-controllers");

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

  let newFileName;
  try {
    if (req.file) {
      if (
        !process.env.R2_ACCESS_KEY_ID ||
        !process.env.R2_SECRET_ACCESS_KEY ||
        !process.env.ENDPOINT ||
        !process.env.BUCKET_NAME
      ) {
        return next(new HttpError("Missing env vars, contact admin!", 404));
      }
      const S3 = new S3Client({
        region: "auto",
        endpoint: process.env.ENDPOINT,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
      });

      newFileName = `${uuid.v1()}-${req.file.originalname}`;
      await S3.send(
        new PutObjectCommand({
          Body: req.file.buffer,
          Bucket: process.env.BUCKET_NAME,
          Key: newFileName,
          ContentType: req.file.mimetype,
        })
      );
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
    console.log("1");
    quizzes = await Quiz.find({ course: course._id });
    console.log("1");
    const sess = await mongoose.startSession();
    sess.startTransaction();
    console.log("2");
    /* Delete all questions of all quizzes of this course */
    // for (let curQuiz of quizzes) {
    //   await Question.deleteMany({ quiz: curQuiz._id }, { session: sess });
    // }

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
  console.log(description);
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

  let oldFile;
  if (req.file && req.file.path) {
    oldFile = course.file;
    course.file = file;
  }

  try {
    await course.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update course.", 500)
    );
  }

  if (oldFile) {
    fs.unlink(oldFile, (err) => {
      console.log(err);
    });
  }

  res.json({
    course: course.toObject({ getters: true }),
  });
};

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
