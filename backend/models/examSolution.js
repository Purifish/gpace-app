const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const examSolutionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: false },
  file: { type: String, required: false },
  /* connect 'course' property to 'Course' schema */
  course: { type: mongoose.Types.ObjectId, required: true, ref: "Course" },
});

module.exports = mongoose.model("ExamSolution", examSolutionSchema);
