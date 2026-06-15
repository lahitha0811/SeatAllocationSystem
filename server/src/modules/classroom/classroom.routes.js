const express = require("express");
const Classroom = require("../../models/Classroom");

const router = express.Router();

/*
GET ALL ROOMS
*/
router.get("/", async (req, res) => {
  try {
    const classrooms = await Classroom.find();

    res.json({
      success: true,
      classrooms
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/*
CREATE ROOM
*/
router.post("/", async (req, res) => {
  try {
    const { roomNumber, rows, cols } = req.body;

    const classroom = await Classroom.create({
      roomNumber,
      rows,
      cols
    });

    res.status(201).json({
      success: true,
      classroom
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;