const express = require("express");

const notesControllers = require("../controllers/notes-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

// router.get("/:topic", notesControllers.getQuestionsByTopic);

router.post("/", fileUpload.single("image"), notesControllers.createNote);

// router.patch(
//   "/:qid",
//   fileUpload.single("image"),
//   notesControllers.updateQuestion
// );

module.exports = router;
