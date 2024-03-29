const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Course = require("../models/course");
const Video = require("../models/video");

const deleteVideo = async (req, res, next) => {
  const videoId = req.params.videoId;
  let video;

  try {
    /* 
      populates the "course" property with the actual course documents (not just ID)
      Only works if the schemas are related with "ref"
    */
    video = await Video.findById(videoId).populate("course");
  } catch (err) {
    return next(
      new HttpError("Something went wrong when accessing the DB", 500)
    );
  }

  if (!video) {
    return next(new HttpError("Invalid video ID", 404));
  }

  // TODO: Add authorization similar to below

  // if (note.creator.id !== req.userData.userId) {
  //   return next(
  //     new HttpError("Error: User is not authorized to edit this place!", 401)
  //   );
  // }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Video.findByIdAndRemove(videoId, { session: sess });

    /* Remove the note from notes list of the course */
    video.course.videos.pull(video);
    await video.course.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Something went wrong!", 500));
  }

  res.json({
    message: "Deleted video resource successfully!",
    videoId: videoId,
  });
};

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

/* Tested */
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

    await createdVideoResource.save({ session: session }); // remember to specify the session
    course.videos.push(createdVideoResource); // only the ID is actually pushed
    await course.save({ session: session });
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
exports.deleteVideo = deleteVideo;
