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

router.patch(
  "/update/:courseId",
  fileUpload.pdfUpload.any(),
  coursesControllers.updateCourse
);

router.get(
  "/:courseTitle",
  fileUpload.pdfUpload.any(),
  coursesControllers.getResourcesByCourseId
);

router.get(
  "/id/:courseId",
  fileUpload.pdfUpload.any(),
  coursesControllers.getResourcesByCourseId
);

module.exports = router;
