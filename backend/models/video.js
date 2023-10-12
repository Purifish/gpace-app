const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  course: { type: mongoose.Types.ObjectId, required: true, ref: "Course" },
});

module.exports = mongoose.model("Video", videoSchema);
