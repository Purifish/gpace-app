const HttpError = require("../models/http-error");
const Course = require("../models/course");
const Video = require("../models/video");
const mongoose = require("mongoose");

const createVideo = async (req, res, next) => {
  const { courseId, title, description, link } = req.body;

  console.log(req.body);
  let course;

  /* Check that the course exists first*/
  try {
    course = await Course.findById(courseId);
  } catch (err) {
    const error = new HttpError("Failed to add video! Try again.", 500);
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Invalid course ID", 404);
    return next(error);
  }

  if (!link) {
    return next(new HttpError("Provide a linkss!", 422));
  }

  const createdVideoResource = new Video({
    title: title,
    description: description,
    link: link,
    course: courseId,
  });

  try {
    const session = await mongoose.startSession(); // start session
    session.startTransaction();
    console.log("0");

    await createdVideoResource.save({ session: session }); // remember to specify the session
    console.log("1");
    course.videos.push(createdVideoResource); // only the ID is actually pushed
    await course.save({ session: session });
    console.log("2");
    await session.commitTransaction(); // all changes successful, commit them to the DB
  } catch (err) {
    const error = new HttpError("Failed to create note, try again.", 500);
    return next(error);
  }

  res.status(201).json({
    note: createdVideoResource,
  });
};

exports.createVideo = createVideo;
