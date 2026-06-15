const Room = require("./room.model");

const createRoomService = async (data) => {
  return await Room.create(data);
};

const getRoomsService = async () => {
  return await Room.find();
};

module.exports = {
  createRoomService,
  getRoomsService
};