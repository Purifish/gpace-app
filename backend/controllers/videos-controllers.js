const HttpError = require("../models/http-error");
const Course = require("../models/course");
const Video = require("../models/video");
const mongoose = require("mongoose");

const updateVideo = async (req, res, next) => {
  const { title, description, link } = req.body;

  let video;
  try {
    video = await Video.findById(req.params.videoId);
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong! could not update video resource.",
        500
      )
    );
  }

  if (!video) {
    return next(new HttpError("Invalid video ID", 500));
  }

  if (title) video.title = title;
  if (description) video.description = description;
  if (link) video.link = link;

  try {
    await video.save();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong, could not update video resource.",
        500
      )
    );
  }

  res.json({
    video: video.toObject({ getters: true }),
  });
};

const createVideo = async (req, res, next) => {
  const courseId = req.params.courseId;
  const { title, description, link } = req.body;

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
    return next(new HttpError("Provide a link!", 422));
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
exports.updateVideo = updateVideo;
