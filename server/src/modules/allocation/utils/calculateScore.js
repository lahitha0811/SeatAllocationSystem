function calculateScore(classrooms) {

  let score = 0;

  for (const classroom of classrooms) {

    if (
      !classroom ||
      !classroom.matrix
    ) {
      continue;
    }

    const matrix =
      classroom.matrix;

    if (
      !Array.isArray(matrix) ||
      matrix.length === 0
    ) {
      continue;
    }

    for (
      let i = 0;
      i < matrix.length;
      i++
    ) {

      for (
        let j = 0;
        j < matrix[i].length;
        j++
      ) {

        const student =
          matrix[i][j];

        if (!student)
          continue;

        const directions = [

          [0, 1],
          [1, 0],
          [1, 1],
          [1, -1]
        ];

        for (
          const [dx, dy]
          of directions
        ) {

          const nr =
            i + dx;

          const nc =
            j + dy;

          if (
            nr >= 0 &&
            nr < matrix.length &&
            nc >= 0 &&
            nc < matrix[nr].length
          ) {

            const neighbor =
              matrix[nr][nc];

            if (
              neighbor &&
              neighbor.branch !==
                student.branch
            ) {
              score++;
            }
          }
        }
      }
    }
  }

  return score;
}

module.exports =
  calculateScore;