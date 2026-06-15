function countViolations(classrooms) {

  let violations = 0;

  const directions = [

    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal down-right
    [1, -1]   // diagonal down-left

  ];

  for (const classroom of classrooms) {

    const matrix = classroom.matrix;

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

            if (!neighbor)
              continue;

            if (

              neighbor.branch ===
              student.branch

            ) {

              violations++;
            }
          }
        }
      }
    }
  }

  return violations;
}

module.exports =
  countViolations;