"use strict";

const mongoose = require("mongoose");

const connectString =""
  // "mongodb+srv://haphuocsang1801:Sang18012001@twitter.hjjx4s0.mongodb.net/";
mongoose
  .connect(connectString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

module.exports = mongoose;