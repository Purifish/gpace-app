const express = require("express");

const questionControllers = require("../controllers/questions-controllers");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("TEST");
  res.status(200).json({
    message: "Hello, all good",
  });
});

router.post("/", questionControllers.createQuestion);

module.exports = router;
