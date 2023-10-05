const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true } /* e.g. What is 1 + 1? */,
  options: [{ type: String, required: true }],
  solution: [{ type: Number, required: true }],
  score: { type: Number, required: true },
  type: { type: String, required: true },
  image: { type: String, required: false },
  /* connect 'quiz' property to 'Quiz' schema */
  quiz: { type: mongoose.Types.ObjectId, required: true, ref: "Quiz" },
});

/* This will refer to the "questions" collection */
module.exports = mongoose.model("Question", questionSchema);
