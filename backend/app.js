const fs = require("fs");
const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const examPapersRoutes = require("./routes/examPapers-routes");
const examSolutionRoutes = require("./routes/examSolutions-routes");
const quizzesRoutes = require("./routes/quizzes-routes");
const questionsRoutes = require("./routes/questions-routes");
const coursesRoutes = require("./routes/courses-routes");
const notesRoutes = require("./routes/notes-routes");
const videosRoutes = require("./routes/videos-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

/* For serving images */
app.use("/uploads/images", express.static(path.join("uploads", "images")));

/* For serving pdfs */
app.use("/uploads/pdf", express.static(path.join("uploads", "pdf")));

/* Handle CORS errors */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/quizzes", quizzesRoutes);

app.use("/api/questions", questionsRoutes);

app.use("/api/courses", coursesRoutes);

app.use("/api/notes", notesRoutes);

app.use("/api/video", videosRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/exam-papers", examPapersRoutes);

app.use("/api/exam-solutions", examSolutionRoutes);

/*
  "default" path
  Handles requests to unsupported paths
*/
app.use((req, res, next) => {
  const error = new HttpError("Invalid path", 404);
  throw error;
});

/*
  Error-handling middleware
  Catches an error thrown by above middleware
*/
app.use((err, req, res, next) => {
  if (req.file) {
    console.log("Error occurred, deleting file");
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  console.log(err.message);
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);

  res.json({
    message: err.message || "An unknown error occurred!",
  });
});

const connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.dejl43o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

/* Handles the connection to the DB */
mongoose
  .connect(connectionUrl)
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log("Connected to DB");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });
