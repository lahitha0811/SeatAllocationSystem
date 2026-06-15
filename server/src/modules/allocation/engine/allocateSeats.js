const isValidSeat =
  require("../constraints/isValidSeat");

const allocateSeats =
  (
    matrix,
    students
  ) => {

    let index = 0;

    for (
      let i = 0;
      i < matrix.length;
      i++
    ) {

      for (
        let j = 0;
        j < matrix[0].length;
        j++
      ) {

        if (
          index >= students.length
        ) {
          return matrix;
        }

        const student =
          students[index];

        if (

          isValidSeat(
            matrix,
            i,
            j,
            student
          )

        ) {

          matrix[i][j] =
            student;

          index++;
        }
      }
    }

    return matrix;
  };

module.exports =
  allocateSeats;