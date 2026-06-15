const isValidSeat =
  require("../constraints/isValidSeat");

const sortClassroomsByOccupancy =
  require(
    "../utils/sortClassroomsByOccupancy"
  );

const backtrackingAllocate =
  (
    classrooms,
    students,
    studentIndex = 0
  ) => {

    /* ---------------- BASE CASE ---------------- */

    if (
      studentIndex >= students.length
    ) {
      return true;
    }

    const student =
      students[studentIndex];

    /* ---------------- SORT ROOMS ---------------- */

    classrooms =
      sortClassroomsByOccupancy(
        classrooms
      );

    /* ---------------- TRY EACH ROOM ---------------- */

    for (
      const classroom
      of classrooms
    ) {

      const matrix =
        classroom.matrix;

      /* ---------------- TRY EACH SEAT ---------------- */

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

          /* ---------------- EMPTY SEAT ---------------- */

          if (
            matrix[i][j]
          ) {
            continue;
          }

          /* ---------------- VALIDATE ---------------- */

          if (
            !isValidSeat(
              matrix,
              i,
              j,
              student
            )
          ) {
            continue;
          }

          /* ---------------- PLACE ---------------- */

          matrix[i][j] =
            student;

          /* ---------------- RECURSE ---------------- */

          const success =
            backtrackingAllocate(
              classrooms,
              students,
              studentIndex + 1
            );

          if (success) {
            return true;
          }

          /* ---------------- BACKTRACK ---------------- */

          matrix[i][j] =
            null;
        }
      }
    }

    /* ---------------- FAILED ---------------- */

    return false;
  };

module.exports =
  backtrackingAllocate;