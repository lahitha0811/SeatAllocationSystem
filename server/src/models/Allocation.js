const mongoose = require("mongoose");

const allocationSchema =
  new mongoose.Schema({

    roomNumber: {
      type: String,
      required: true
    },

    row: {
      type: Number,
      required: true
    },

    col: {
      type: Number,
      required: true
    },

    hallTicket: {
      type: String,
      required: true
    },

    branch: {
      type: String,
      required: true
    },

    subjectCode: {
      type: String,
      required: true
    },

    session: {
      type: String,
      required: true
    },

    examDate: {
      type: Date,
      required: true
    }

  }, {
    timestamps: true
  });

module.exports =
  mongoose.model(
    "Allocation",
    allocationSchema
  );