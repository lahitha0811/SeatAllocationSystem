const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: String,

    building: String,

    floor: Number,

    capacity: Number,

    type: {
      type: String,
      enum: ["classroom", "lab", "seminar"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Room",
  roomSchema
);