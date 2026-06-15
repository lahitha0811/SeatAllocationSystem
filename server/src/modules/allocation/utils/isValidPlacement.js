function isValidPlacement(
  grid,
  row,
  col,
  candidate
) {

  const directions = [

  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],

  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1]
];

  for (const [dx, dy] of directions) {

    const newRow = row + dx;
    const newCol = col + dy;

    // --------------------------------
    // BOUNDARY CHECK
    // --------------------------------

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length
    ) {

      const neighbor =
        grid[newRow][newCol];

      // Empty seat

      if (!neighbor) {
        continue;
      }

      // --------------------------------
      // SAME SUBJECT CONSTRAINT
      // --------------------------------

      if (
        neighbor.exam.subjectCode ===
        candidate.exam.subjectCode
      ) {

        console.log(
          "Rejected:same subject nearby"
        );

        return false;
      }
    }
  }

  return true;
}

module.exports =
  isValidPlacement;