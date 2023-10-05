const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true } /* E.g. First-half Quiz */,
  course: { type: mongoose.Types.ObjectId, required: true, ref: "Course" },
  questions: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Question" },
  ],
});

// quizSchema.plugin(uniqueValidator); // force title to be unique

module.exports = mongoose.model("Quiz", quizSchema);
