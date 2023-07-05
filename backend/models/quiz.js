const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Question" },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
