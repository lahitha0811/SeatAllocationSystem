const students = [
  {
    name: "A",
    branch: "CSE"
  },

  {
    name: "B",
    branch: "CSE"
  },

  {
    name: "C",
    branch: "ECE"
  },

  {
    name: "D",
    branch: "EEE"
  }
];

const createSeatGrid =
  require("./utils/createSeatGrid");

const grid =
  createSeatGrid(2, 3);

console.log(grid);