const createSeatMatrix =
  require("./createSeatMatrix");

const createClassroomMatrices =
  (classrooms) => {

    return classrooms.map(
      (classroom) => ({

        roomNumber:
          classroom.roomNumber,

        matrix:
          createSeatMatrix(
            classroom.rows,
            classroom.cols
          )

      })
    );
  };

module.exports =
  createClassroomMatrices;