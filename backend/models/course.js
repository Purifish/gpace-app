const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const courseSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
    required: true,
    unique: true,
  } /* e.g. Geography */,
  courseCode: { type: String, required: true, unique: true } /* e.g. CX3005 */,
  description: { type: String, required: false },
  image: { type: String, required: false } /* file path */,
  quizzes: [{ type: mongoose.Types.ObjectId, required: true, ref: "Quiz" }],
  notes: [{ type: mongoose.Types.ObjectId, required: true, ref: "Note" }],
  faqs: [{ type: mongoose.Types.ObjectId, required: true, ref: "Faq" }],
  videos: [{ type: mongoose.Types.ObjectId, required: true, ref: "Video" }],
  examPapers: [
    { type: mongoose.Types.ObjectId, required: true, ref: "ExamPaper" },
  ],
  examSolutions: [
    { type: mongoose.Types.ObjectId, required: true, ref: "ExamSolution" },
  ],
});

courseSchema.plugin(uniqueValidator); // force courseTitle to be unique

module.exports = mongoose.model("Course", courseSchema);
