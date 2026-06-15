const mongoose = require("mongoose");

const registrationSchema =
  new mongoose.Schema({

    hallTicket: {
      type: String,
      required: true
    },

    subjectCode: {
      type: String,
      required: true
    }

  });

module.exports =
  mongoose.model(
    "Registration",
    registrationSchema
  );