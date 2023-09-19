const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const quizSchema = new mongoose.Schema({
  topic: { type: String, required: true } /* e.g. Geography */,
  questions: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Question" },
  ],
});

quizSchema.plugin(uniqueValidator); // force topic to be unique

module.exports = mongoose.model("Quiz", quizSchema);
