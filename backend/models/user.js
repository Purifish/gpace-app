const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  privilege: { type: String, required: true },
  notes: [{ type: mongoose.Types.ObjectId, required: true, ref: "Note" }],
  videos: [{ type: mongoose.Types.ObjectId, required: true, ref: "Video" }],
});

userSchema.plugin(uniqueValidator); // now email is forced to be unique

module.exports = mongoose.model("User", userSchema);
