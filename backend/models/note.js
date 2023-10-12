const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: false },
  file: { type: String, required: false },
  /* connect 'courseTitle' property to 'Course' schema */
  course: { type: mongoose.Types.ObjectId, required: true, ref: "Course" },
});

// noteSchema.plugin(uniqueValidator); // force title to be unique

module.exports = mongoose.model("Note", noteSchema);
