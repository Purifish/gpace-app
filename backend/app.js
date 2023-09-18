const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

const connectionUrl = ``;

/* Handles the connection to the DB */
mongoose
  .connect(url)
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log("Connected to DB");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });
