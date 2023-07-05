const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: [{ type: String, required: true }],
  solution: { type: Number, required: true },
  score: { type: Number, required: true },
  /* connect 'topic' property to 'Quiz' schema */
  topic: { type: mongoose.Types.ObjectId, required: true, ref: "Quiz" },
});

/* This will refer to the "questions" collection */
module.exports = mongoose.model("Question", questionSchema);
