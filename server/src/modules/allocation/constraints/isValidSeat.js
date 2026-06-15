const isValidSeat =
  (
    matrix,
    row,
    col,
    student
  ) => {

    const directions = [

  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],

  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1]

];

    for (const [dx, dy] of directions) {

      const nr = row + dx;
      const nc = col + dy;

      if (

        nr >= 0 &&
        nr < matrix.length &&

        nc >= 0 &&
        nc < matrix[0].length

      ) {

        const neighbor = matrix[nr][nc];

        if (!neighbor) {
          continue;
        }

        if (
          neighbor.branch ===
            student.branch
        ) {
          return false;
        }

        if (
          neighbor.subjectCode ===
            student.subjectCode
        ) {
          return false;
        }
      }
    }

    return true;
  };

module.exports =
  isValidSeat;