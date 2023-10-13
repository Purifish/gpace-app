const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

const fileUpload = require("../middleware/file-upload");

const router = express.Router();

// router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  fileUpload.imageUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  usersControllers.signup
);

router.post("/login", fileUpload.imageUpload.any(), usersControllers.login);

module.exports = router;
