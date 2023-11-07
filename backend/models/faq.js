const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  /* connect 'course' property to 'Course' schema */
  course: { type: mongoose.Types.ObjectId, required: true, ref: "Course" },
});

module.exports = mongoose.model("Faq", faqSchema);
