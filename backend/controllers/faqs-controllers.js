const HttpError = require("../models/http-error");
const Course = require("../models/course");
const Faq = require("../models/faq");
const mongoose = require("mongoose");

const deleteFaq = async (req, res, next) => {
  const faqId = req.params.faqId;
  let faq;

  try {
    /* 
      populates the "course" property with the actual course documents (not just ID)
      Only works if the schemas are related with "ref"
    */
    faq = await Faq.findById(faqId).populate("course");
  } catch (err) {
    return next(
      new HttpError("Something went wrong when accessing the DB", 500)
    );
  }

  if (!faq) {
    return next(new HttpError("Invalid faq ID", 404));
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
    await Faq.findByIdAndRemove(faqId, { session: sess });

    /* Remove the note from notes list of the course */
    faq.course.faqs.pull(faq);
    await faq.course.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Something went wrong!", 500));
  }

  res.json({
    message: "Deleted faq successfully!",
    faqId: faqId,
  });
};

const updateFaq = async (req, res, next) => {
  const { question, answer } = req.body;

  let faq;
  try {
    faq = await Faq.findById(req.params.faqId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong! could not update faq.", 500)
    );
  }

  if (!faq) {
    return next(new HttpError("Invalid faq ID", 500));
  }

  if (question) faq.question = question;
  if (answer) faq.answer = answer;

  try {
    await faq.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update faq.", 500)
    );
  }

  res.json({
    faq: faq.toObject({ getters: true }),
  });
};

/* Tested */
const createFaq = async (req, res, next) => {
  const courseId = req.params.courseId;
  const { question, answer } = req.body;
  let course;

  /* Check that the course exists first */
  try {
    course = await Course.findById(courseId);
  } catch (err) {
    const error = new HttpError("Failed to add faq! Try again.", 500);
    return next(error);
  }

  if (!course) {
    const error = new HttpError("Invalid course ID", 404);
    return next(error);
  }

  const createdFaq = new Faq({
    question: question,
    answer: answer,
    course: courseId,
  });

  try {
    const session = await mongoose.startSession(); // start session
    session.startTransaction();
    console.log("0");

    await createdFaq.save({ session: session }); // remember to specify the session
    console.log("1");
    course.faqs.push(createdFaq); // only the ID is actually pushed
    await course.save({ session: session });
    console.log("2");
    await session.commitTransaction(); // all changes successful, commit them to the DB
  } catch (err) {
    const error = new HttpError("Failed to create faq, try again.", 500);
    return next(error);
  }

  res.status(201).json({
    faq: createdFaq,
  });
};

exports.createFaq = createFaq;
exports.updateFaq = updateFaq;
exports.deleteFaq = deleteFaq;
