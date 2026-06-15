function calculateScore(classrooms) {

  let score = 0;

  for (const classroom of classrooms) {

    const matrix =
      classroom.matrix;

    for (
      let row = 0;
      row < matrix.length;
      row++
    ) {

      for (
        let col = 0;
        col < matrix[0].length;
        col++
      ) {

        const student =
          matrix[row][col];

        if (!student)
          continue;

        const directions = [
          [0,1],
          [1,0],
          [1,1],
          [1,-1]
        ];

        for (
          const [dx,dy]
          of directions
        ) {

          const nr =
            row + dx;

          const nc =
            col + dy;

          if (
            nr < matrix.length &&
            nc >= 0 &&
            nc < matrix[0].length
          ) {

            const neighbor =
              matrix[nr][nc];

            if (!neighbor)
              continue;

            if (
              neighbor.branch !==
              student.branch
            ) {
              score += 10;
            }

            if (
              neighbor.subjectCode !==
              student.subjectCode
            ) {
              score += 5;
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