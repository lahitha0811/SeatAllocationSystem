const mongoose = require("mongoose");

const studentSchema =
  new mongoose.Schema({

    hallTicket: {
      type: String,
      required: true,
      unique: true
    },

    name: {
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
    }

  });

module.exports =
  mongoose.model(
    "Student",
    studentSchema
  );