const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true } /* e.g. Geography */,
  courseCode: { type: String, required: false } /* e.g. CX3005 */,
  image: { type: String, required: false } /* file path */,
  quizQuestions: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Question" },
  ],
  notes: [{ type: mongoose.Types.ObjectId, required: true, ref: "Note" }],
  videos: [{ type: mongoose.Types.ObjectId, required: true, ref: "Video" }],
});

courseSchema.plugin(uniqueValidator); // force courseTitle to be unique

module.exports = mongoose.model("Course", courseSchema);
