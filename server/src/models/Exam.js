const mongoose = require("mongoose");

const examSchema =
  new mongoose.Schema({

    subjectCode: {
      type: String,
      required: true
    },

    subjectName: {
      type: String,
      required: true
    },

    branch: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    examDate: Date,

    session: {
      type: String,
      enum: ["FN", "AN"]
    }

  });

module.exports =
  mongoose.model(
    "Exam",
    examSchema
  );