const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },

  rows: {
    type: Number,
    required: true
  },

  cols: {
    type: Number,
    required: true
  }
});

module.exports =
  mongoose.model(
    "Classroom",
    classroomSchema
  );