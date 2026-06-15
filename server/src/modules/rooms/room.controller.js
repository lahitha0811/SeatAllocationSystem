const {
  createRoomService,
  getRoomsService
} = require("./room.service");

const createRoom = async (req, res) => {
  try {
    const room = await createRoomService(req.body);

    res.status(201).json({
      success: true,
      room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await getRoomsService();

    res.json({
      success: true,
      rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createRoom,
  getRooms
};