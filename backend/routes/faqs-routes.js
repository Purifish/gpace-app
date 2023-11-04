const express = require("express");

const faqsControllers = require("../controllers/faqs-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.post(
  "/create/:courseId",
  fileUpload.pdfUpload.single("pdf"),
  faqsControllers.createFaq
);

router.patch(
  "/update/:faqId",
  fileUpload.pdfUpload.single("pdf"),
  faqsControllers.updateFaq
);

router.delete(
  "/delete/:faqId",
  fileUpload.pdfUpload.any(),
  faqsControllers.deleteFaq
);

module.exports = router;
