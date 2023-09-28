const express = require("express");
// const { check } = require("express-validator");

const coursesControllers = require("../controllers/courses-controllers");

const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", coursesControllers.getCourses);

router.post(
  "/create",
  fileUpload.imageUpload.single("image"),
  coursesControllers.createCourse
);

router.get("/:courseId", coursesControllers.getResourcesByCourseId);

// router.post("/dummy", fileUpload.single("image"), async (req, res, next) => {
//   console.log("YOO");
//   res.status(201).json({
//     message: "OK",
//   });
// });

module.exports = router;
